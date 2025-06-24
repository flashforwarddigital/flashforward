-- Enable Row Level Security on todos and notes tables if not already enabled
ALTER TABLE IF EXISTS todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notes ENABLE ROW LEVEL SECURITY;

-- Create policies for todos
CREATE POLICY IF NOT EXISTS "Authenticated users can create todos" 
  ON todos FOR INSERT TO authenticated 
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can delete their own todos" 
  ON todos FOR DELETE TO authenticated 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Authenticated users can update their own todos" 
  ON todos FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Authenticated users can view their own todos" 
  ON todos FOR SELECT TO authenticated 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for notes
CREATE POLICY IF NOT EXISTS "Authenticated users can create notes" 
  ON notes FOR INSERT TO authenticated 
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can delete their own notes" 
  ON notes FOR DELETE TO authenticated 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Authenticated users can update their own notes" 
  ON notes FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Authenticated users can view their own notes" 
  ON notes FOR SELECT TO authenticated 
  USING (auth.uid() = user_id OR user_id IS NULL);