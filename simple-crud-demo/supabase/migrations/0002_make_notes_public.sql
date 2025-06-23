-- Disable Row Level Security on the 'notes' table.
-- This makes the table publicly accessible.
ALTER TABLE public.notes DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies since RLS is disabled.
DROP POLICY IF EXISTS "Allow authenticated users to create notes" ON public.notes;
DROP POLICY IF EXISTS "Allow authenticated users to read their own notes" ON public.notes;
DROP POLICY IF EXISTS "Allow authenticated users to update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own notes" ON public.notes;

-- Remove the user_id column as it is no longer needed for a public notes board.
ALTER TABLE public.notes DROP COLUMN IF EXISTS user_id;