CREATE OR REPLACE FUNCTION public.get_tenant_notes(tenant_schema TEXT)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  notes_json json;
BEGIN
  -- Use format() to safely quote the schema name and prevent SQL injection
  -- json_agg aggregates all rows into a single JSON array
  EXECUTE format('SELECT json_agg(t) FROM %I.notes t', tenant_schema)
  INTO notes_json;
  
  -- Return the JSON array of notes
  RETURN notes_json;
END;
$$;