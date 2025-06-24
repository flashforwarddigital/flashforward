/*
  # Create Subscriptions and Financial Tables

  1. New Tables
     - `subscriptions` - For managing customer subscriptions
     - `api_costs` - For tracking API usage costs
     - `revenues` - For tracking income sources
     - `expenses` - For tracking business expenses
     - `clients` - For managing client information
     - `jobs` - For tracking client projects

  2. Security
     - Enable RLS on all tables
     - Add policies for authenticated users to manage their data
     - Create appropriate foreign key relationships

  3. Functions
     - Add helper functions for table creation that the application expects
*/

-- Create Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  plan_name text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  interval text NOT NULL CHECK (interval IN ('month', 'year')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  start_date date NOT NULL,
  end_date date,
  next_billing_date date,
  payment_method text,
  created_at timestamptz DEFAULT now()
);

-- Create API Costs table
CREATE TABLE IF NOT EXISTS public.api_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  service text NOT NULL,
  cost numeric NOT NULL,
  period text DEFAULT 'monthly',
  date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create Revenues table
CREATE TABLE IF NOT EXISTS public.revenues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  amount numeric NOT NULL,
  date date NOT NULL,
  description text,
  category text DEFAULT 'subscription',
  created_at timestamptz DEFAULT now()
);

-- Create Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  amount numeric NOT NULL,
  date date NOT NULL,
  description text,
  recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
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

-- Enable RLS on all tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for Subscriptions
CREATE POLICY "Allow authenticated users to read subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert subscriptions"
  ON public.subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update subscriptions"
  ON public.subscriptions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete subscriptions"
  ON public.subscriptions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for API Costs
CREATE POLICY "Allow authenticated users to read api costs"
  ON public.api_costs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert api costs"
  ON public.api_costs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update api costs"
  ON public.api_costs
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete api costs"
  ON public.api_costs
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for Revenues
CREATE POLICY "Allow authenticated users to read revenues"
  ON public.revenues
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert revenues"
  ON public.revenues
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update revenues"
  ON public.revenues
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete revenues"
  ON public.revenues
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for Expenses
CREATE POLICY "Allow authenticated users to read expenses"
  ON public.expenses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert expenses"
  ON public.expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update expenses"
  ON public.expenses
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete expenses"
  ON public.expenses
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for Clients
CREATE POLICY "Allow authenticated users to read clients"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert clients"
  ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update clients"
  ON public.clients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete clients"
  ON public.clients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for Jobs
CREATE POLICY "Allow authenticated users to read jobs"
  ON public.jobs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert jobs"
  ON public.jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update jobs"
  ON public.jobs
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete jobs"
  ON public.jobs
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON public.subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_api_costs_date ON public.api_costs(date);
CREATE INDEX IF NOT EXISTS idx_api_costs_provider ON public.api_costs(provider);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON public.revenues(date);
CREATE INDEX IF NOT EXISTS idx_revenues_category ON public.revenues(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id);

-- Create helper functions for table creation that the application expects
CREATE OR REPLACE FUNCTION public.create_subscriptions_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since we've already created the table
  -- But we keep it to satisfy the application's expectations
  RAISE NOTICE 'Subscriptions table already exists';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_api_costs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since we've already created the table
  RAISE NOTICE 'API costs table already exists';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_revenues_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since we've already created the table
  RAISE NOTICE 'Revenues table already exists';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_expenses_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since we've already created the table
  RAISE NOTICE 'Expenses table already exists';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_clients_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since we've already created the table
  RAISE NOTICE 'Clients table already exists';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_jobs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since we've already created the table
  RAISE NOTICE 'Jobs table already exists';
END;
$$;