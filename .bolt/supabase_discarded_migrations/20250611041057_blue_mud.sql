/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `customer_id` (text, not null)
      - `customer_name` (text, not null)
      - `customer_email` (text, not null)
      - `plan_name` (text, not null)
      - `amount` (numeric, not null)
      - `currency` (text, not null)
      - `interval` (text, not null)
      - `status` (text, not null)
      - `start_date` (date, not null)
      - `end_date` (date)
      - `next_billing_date` (date)
      - `payment_method` (text)
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  plan_name text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  interval text NOT NULL CHECK (interval IN ('month', 'year')),
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  start_date date NOT NULL,
  end_date date,
  next_billing_date date,
  payment_method text
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to insert subscriptions'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert subscriptions"
      ON subscriptions
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to select subscriptions'
  ) THEN
    CREATE POLICY "Allow authenticated users to select subscriptions"
      ON subscriptions
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to update subscriptions'
  ) THEN
    CREATE POLICY "Allow authenticated users to update subscriptions"
      ON subscriptions
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated users to delete subscriptions'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete subscriptions"
      ON subscriptions
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;