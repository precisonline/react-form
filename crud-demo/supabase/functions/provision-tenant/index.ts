/// <reference lib="deno.ns" />

import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

console.log(`Function 'provision-tenant' up and running!`)

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tenant_name } = await req.json()
    if (!tenant_name) {
      throw new Error('`tenant_name` is required in the request body.')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate a unique schema name
    const schemaName = `tenant_${crypto.randomUUID().replace(/-/g, '')}`

    console.log('Environment variables:', {
      url: Deno.env.get('SUPABASE_URL') ? 'SET' : 'NOT SET',
      serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'SET' : 'NOT SET',
    })

    console.log(`Creating schema: ${schemaName} for tenant: ${tenant_name}`)

    // Step 1: Create the new schema
    const { error: schemaError } = await supabaseAdmin.rpc(
      'create_tenant_schema',
      {
        schema_name: schemaName,
      }
    )

    if (schemaError) {
      console.error('Error creating schema:', schemaError)
      throw new Error(`Failed to create schema: ${schemaError.message}`)
    }

    // Step 2: Create tables in the new schema
    const createTablesSQL = `
      -- Set search path to the new schema
      SET search_path TO ${schemaName};
      
      -- Create notes table in the new schema
      CREATE TABLE notes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create updated_at trigger function (if it doesn't exist globally)
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create trigger for notes table
      CREATE TRIGGER update_notes_updated_at 
        BEFORE UPDATE ON notes 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();

      -- Enable RLS
      ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

      -- Create policy for notes
      CREATE POLICY "Allow all operations on notes" ON notes
        FOR ALL 
        TO authenticated, anon
        USING (true)
        WITH CHECK (true);

      -- Insert sample data
      INSERT INTO notes (title, content) VALUES 
        ('Welcome to ${tenant_name}', 'This is your tenant-specific note!'),
        ('Getting Started', 'Each tenant has their own isolated data.');

      -- Reset search path
      SET search_path TO public;
    `

    const { error: tablesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: createTablesSQL,
    })

    if (tablesError) {
      console.error('Error creating tables:', tablesError)
      throw new Error(`Failed to create tables: ${tablesError.message}`)
    }

    // Step 3: Store tenant information in a central table
    const { error: tenantError } = await supabaseAdmin.from('tenants').insert({
      tenant_name: tenant_name,
      schema_name: schemaName,
      created_at: new Date().toISOString(),
    })

    if (tenantError) {
      console.error('Error storing tenant info:', tenantError)
    }

    console.log(
      `Successfully created tenant: ${tenant_name} with schema: ${schemaName}`
    )

    return new Response(
      JSON.stringify({
        success: true,
        tenant_name: tenant_name,
        schema_name: schemaName,
        message: 'Tenant provisioned successfully!',
        next_steps: [
          'Use the schema_name to connect to tenant-specific tables',
          'Update your Supabase client configuration',
          'Start using tenant-isolated data',
        ],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    console.error('An error occurred:', errorMessage)
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
