/*
  # Create Replicate Generations Table and Policies

  1. New Tables
    - `replicate_generations` - Stores AI image generation results
      - `id` (text, primary key)
      - `prompt` (text, not null)
      - `status` (text, not null)
      - `output` (text array)
      - `error` (text)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `replicate_generations` table
    - Add policies for authenticated users to insert, select, and update generations
*/

-- Create the replicate_generations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.replicate_generations (
  id text PRIMARY KEY,
  prompt text NOT NULL,
  status text NOT NULL,
  output text[],
  error text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.replicate_generations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  -- Check and drop insert policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'replicate_generations' 
    AND policyname = 'Allow authenticated users to insert generations'
  ) THEN
    DROP POLICY "Allow authenticated users to insert generations" ON public.replicate_generations;
  END IF;
  
  -- Check and drop select policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'replicate_generations' 
    AND policyname = 'Allow authenticated users to read generations'
  ) THEN
    DROP POLICY "Allow authenticated users to read generations" ON public.replicate_generations;
  END IF;
  
  -- Check and drop update policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'replicate_generations' 
    AND policyname = 'Allow authenticated users to update generations'
  ) THEN
    DROP POLICY "Allow authenticated users to update generations" ON public.replicate_generations;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Allow authenticated users to insert generations"
  ON public.replicate_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read generations"
  ON public.replicate_generations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update generations"
  ON public.replicate_generations
  FOR UPDATE
  TO authenticated
  USING (true);