/*
  # Create Replicate Generations Table

  1. New Tables
    - `replicate_generations`
      - `id` (text, primary key)
      - `prompt` (text, not null)
      - `status` (text, not null)
      - `output` (text[] array, nullable)
      - `error` (text, nullable)
      - `created_at` (timestamp with time zone, default now())
  
  2. Security
    - Enable RLS on `replicate_generations` table
    - Add policy for authenticated users to read their own data
*/

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