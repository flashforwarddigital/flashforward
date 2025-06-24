/*
  # Create Replicate Generations Table

  1. New Tables
    - `replicate_generations` - Stores image generation requests and results
      - `id` (text, primary key) - The Replicate prediction ID
      - `prompt` (text) - The prompt used for generation
      - `status` (text) - The status of the generation (started, processing, succeeded, failed)
      - `output` (text[]) - Array of output image URLs
      - `error` (text) - Error message if generation failed
      - `created_at` (timestamptz) - When the generation was created

  2. Security
    - Enable RLS on `replicate_generations` table
    - Add policies for authenticated users to insert, select, and update generations
*/

-- Create the replicate_generations table if it doesn't exist
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