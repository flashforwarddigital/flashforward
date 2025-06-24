-- Create the replicate_generations table
CREATE TABLE IF NOT EXISTS replicate_generations (
  id text PRIMARY KEY,
  prompt text NOT NULL,
  status text NOT NULL,
  output text[],
  error text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE replicate_generations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to insert generations"
  ON replicate_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read generations"
  ON replicate_generations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update generations"
  ON replicate_generations
  FOR UPDATE
  TO authenticated
  USING (true);