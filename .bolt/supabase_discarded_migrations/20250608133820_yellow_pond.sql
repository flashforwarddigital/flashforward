/*
  # Fix Row-Level Security Policies for Todos Table

  1. Security
    - Enable RLS on todos table if not already enabled
    - Drop existing policies that might be causing issues
    - Create proper policies for authenticated users to manage their own todos
*/

-- First, ensure RLS is enabled
ALTER TABLE IF EXISTS todos ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing issues
DROP POLICY IF EXISTS "Authenticated users can create todos" ON todos;
DROP POLICY IF EXISTS "Authenticated users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Authenticated users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Authenticated users can delete their own todos" ON todos;

-- Create proper policies
CREATE POLICY "Authenticated users can create todos"
ON todos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own todos"
ON todos FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own todos"
ON todos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own todos"
ON todos FOR DELETE
TO authenticated
USING (auth.uid() = user_id);