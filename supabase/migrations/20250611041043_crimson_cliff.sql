/*
  # Create clients and jobs tables

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `phone` (text)
      - `company` (text)
      - `status` (text, with check constraint)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
    - `jobs`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `title` (text, not null)
      - `description` (text)
      - `due_date` (date)
      - `status` (text, with check constraint)
      - `progress` (integer, with check constraint)
      - `assigned_to` (text[])
      - `budget` (numeric)
      - `invoiced_amount` (numeric)
      - `paid_amount` (numeric)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create clients table if it doesn't exist
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  status text CHECK (status IN ('active', 'inactive', 'lead')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'review', 'completed')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_to text[],
  budget numeric,
  invoiced_amount numeric DEFAULT 0,
  paid_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to insert clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert clients"
      ON clients
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to select clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to select clients"
      ON clients
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to update clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to update clients"
      ON clients
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to delete clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete clients"
      ON clients
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for jobs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to insert jobs'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert jobs"
      ON jobs
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to select jobs'
  ) THEN
    CREATE POLICY "Allow authenticated users to select jobs"
      ON jobs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to update jobs'
  ) THEN
    CREATE POLICY "Allow authenticated users to update jobs"
      ON jobs
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to delete jobs'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete jobs"
      ON jobs
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;