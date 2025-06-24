/*
  # Create replicate_generations table

  1. New Tables
    - `replicate_generations` - Stores image generation data from Replicate API
  
  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users
*/

-- Create replicate_generations table if it doesn't exist
CREATE TABLE IF NOT EXISTS replicate_generations (
  id text PRIMARY KEY,
  prompt text NOT NULL,
  status text NOT NULL,
  output text[],
  error text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE replicate_generations ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'replicate_generations' AND policyname = 'Allow authenticated users to insert generations'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert generations"
      ON replicate_generations
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'replicate_generations' AND policyname = 'Allow authenticated users to read generations'
  ) THEN
    CREATE POLICY "Allow authenticated users to read generations"
      ON replicate_generations
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'replicate_generations' AND policyname = 'Allow authenticated users to update generations'
  ) THEN
    CREATE POLICY "Allow authenticated users to update generations"
      ON replicate_generations
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END
$$;