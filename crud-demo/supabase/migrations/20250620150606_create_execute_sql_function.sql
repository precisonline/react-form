CREATE OR REPLACE FUNCTION public.execute_sql (sql_query TEXT)
RETURNS void
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;