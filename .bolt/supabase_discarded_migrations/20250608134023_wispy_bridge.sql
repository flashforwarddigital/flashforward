/*
  # Fix Todos Table RLS Policies

  1. Security
    - Enable RLS on todos table
    - Create policies for anonymous users to insert todos
    - Create policies for public users to select, update, and delete todos
*/

-- First, ensure RLS is enabled
ALTER TABLE IF EXISTS todos ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing issues
DROP POLICY IF EXISTS "Authenticated users can create todos" ON todos;
DROP POLICY IF EXISTS "Authenticated users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Authenticated users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Authenticated users can delete their own todos" ON todos;

-- Create policy for anonymous users to insert todos
CREATE POLICY "Allow insert for anonymous users"
ON todos FOR INSERT
TO anon
WITH CHECK (true);

-- Create policies for public users (both anonymous and authenticated)
CREATE POLICY "Allow select for all users"
ON todos FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow update for all users"
ON todos FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete for all users"
ON todos FOR DELETE
TO public
USING (true);