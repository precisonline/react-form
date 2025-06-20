

-- Secure the execute_sql function
CREATE OR REPLACE FUNCTION public.execute_sql (sql_query TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
-- Forces the function to only look in the 'public' schema.
SET search_path = public;
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;


-- Secure the get_tenant_notes function
CREATE OR REPLACE FUNCTION public.get_tenant_notes(tenant_schema TEXT)
RETURNS json
LANGUAGE plpgsql

SET search_path = public;
AS $$
DECLARE
  notes_json json;
BEGIN
  -- Use format() to safely quote the schema name and prevent SQL injection
  EXECUTE format('SELECT json_agg(t) FROM %I.notes t', tenant_schema)
  INTO notes_json;
  
  RETURN notes_json;
END;
$$;