/*
  # Create financial tables

  1. New Tables
    - `api_costs`
      - `id` (uuid, primary key)
      - `provider` (text, not null)
      - `service` (text, not null)
      - `cost` (numeric, not null)
      - `period` (text, not null)
      - `date` (text, not null)
      - `notes` (text)
    - `revenues`
      - `id` (uuid, primary key)
      - `source` (text, not null)
      - `amount` (numeric, not null)
      - `date` (text, not null)
      - `description` (text)
      - `category` (text, not null)
    - `expenses`
      - `id` (uuid, primary key)
      - `category` (text, not null)
      - `amount` (numeric, not null)
      - `date` (text, not null)
      - `description` (text)
      - `recurring` (boolean, not null)
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create api_costs table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  service text NOT NULL,
  cost numeric NOT NULL,
  period text NOT NULL,
  date text NOT NULL,
  notes text
);

-- Create revenues table if it doesn't exist
CREATE TABLE IF NOT EXISTS revenues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  amount numeric NOT NULL,
  date text NOT NULL,
  description text,
  category text NOT NULL
);

-- Create expenses table if it doesn't exist
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  amount numeric NOT NULL,
  date text NOT NULL,
  description text,
  recurring boolean NOT NULL
);

-- Enable Row Level Security
ALTER TABLE api_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for api_costs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to insert api_costs'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert api_costs"
      ON api_costs
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to select api_costs'
  ) THEN
    CREATE POLICY "Allow authenticated users to select api_costs"
      ON api_costs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to update api_costs'
  ) THEN
    CREATE POLICY "Allow authenticated users to update api_costs"
      ON api_costs
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to delete api_costs'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete api_costs"
      ON api_costs
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for revenues table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to insert revenues'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert revenues"
      ON revenues
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to select revenues'
  ) THEN
    CREATE POLICY "Allow authenticated users to select revenues"
      ON revenues
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to update revenues'
  ) THEN
    CREATE POLICY "Allow authenticated users to update revenues"
      ON revenues
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to delete revenues'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete revenues"
      ON revenues
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for expenses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to insert expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert expenses"
      ON expenses
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to select expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to select expenses"
      ON expenses
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to update expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to update expenses"
      ON expenses
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to delete expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete expenses"
      ON expenses
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;