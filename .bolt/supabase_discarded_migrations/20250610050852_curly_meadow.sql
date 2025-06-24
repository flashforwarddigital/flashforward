-- First check if the table exists, if not create it
CREATE TABLE IF NOT EXISTS public.replicate_generations (
  id text PRIMARY KEY,
  prompt text NOT NULL,
  status text NOT NULL,
  output text[],
  error text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security if not already enabled
ALTER TABLE public.replicate_generations ENABLE ROW LEVEL SECURITY;

-- Drop the conflicting policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'replicate_generations' 
    AND policyname = 'Allow authenticated users to insert generations'
  ) THEN
    DROP POLICY "Allow authenticated users to insert generations" ON public.replicate_generations;
  END IF;
END $$;

-- Create the policy with a slightly different name to avoid conflicts
CREATE POLICY "Allow users to insert generations" 
  ON public.replicate_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Make sure other policies exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'replicate_generations' 
    AND policyname = 'Allow authenticated users to read generations'
  ) THEN
    CREATE POLICY "Allow authenticated users to read generations"
      ON public.replicate_generations
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'replicate_generations' 
    AND policyname = 'Allow authenticated users to update generations'
  ) THEN
    CREATE POLICY "Allow authenticated users to update generations"
      ON public.replicate_generations
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;