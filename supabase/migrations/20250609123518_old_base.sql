/*
  # Create Subscriptions Table and Function

  1. New Tables
    - `subscriptions` - For managing customer subscriptions with fields for customer details, plan info, and billing data
  
  2. Security
    - Enable RLS on the subscriptions table
    - Add policies for authenticated users to perform CRUD operations
  
  3. Functions
    - Create the `create_subscriptions_table` function that the application is trying to call
*/

-- Create the subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON public.subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow insert for authenticated users" 
  ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users" 
  ON public.subscriptions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow update for authenticated users" 
  ON public.subscriptions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow delete for authenticated users" 
  ON public.subscriptions FOR DELETE TO authenticated USING (true);

-- Create the function that the application is trying to call
-- This is a no-op function since we've already created the table above
CREATE OR REPLACE FUNCTION public.create_subscriptions_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Table is already created in the migration, so this is a no-op
  -- But the function needs to exist for the application to work
  RAISE NOTICE 'Subscriptions table already exists';
END;
$$;