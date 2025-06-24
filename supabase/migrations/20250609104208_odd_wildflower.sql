/*
  # Create API Costs Table and Related Functions

  1. New Tables
    - `api_costs`
      - `id` (uuid, primary key)
      - `provider` (text, not null) - API provider name
      - `service` (text, not null) - Service type
      - `cost` (numeric, not null) - Cost amount
      - `period` (text, not null) - Billing period
      - `date` (date, not null) - Date of the cost
      - `notes` (text, optional) - Additional notes
      - `created_at` (timestamp, default now())

    - `revenues`
      - `id` (uuid, primary key)
      - `source` (text, not null) - Revenue source
      - `amount` (numeric, not null) - Revenue amount
      - `date` (date, not null) - Date of revenue
      - `description` (text, optional) - Description
      - `category` (text, not null) - Revenue category
      - `created_at` (timestamp, default now())

    - `expenses`
      - `id` (uuid, primary key)
      - `category` (text, not null) - Expense category
      - `amount` (numeric, not null) - Expense amount
      - `date` (date, not null) - Date of expense
      - `description` (text, optional) - Description
      - `recurring` (boolean, default false) - Is recurring expense
      - `created_at` (timestamp, default now())

    - `clients`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Client name
      - `email` (text, not null) - Client email
      - `phone` (text, optional) - Client phone
      - `company` (text, optional) - Client company
      - `status` (text, default 'lead') - Client status
      - `notes` (text, optional) - Additional notes
      - `created_at` (timestamp, default now())

    - `jobs`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `title` (text, not null) - Job title
      - `description` (text, optional) - Job description
      - `due_date` (date, optional) - Due date
      - `status` (text, default 'not_started') - Job status
      - `progress` (integer, default 0) - Progress percentage
      - `assigned_to` (text[], optional) - Assigned team members
      - `budget` (numeric, optional) - Job budget
      - `invoiced_amount` (numeric, default 0) - Amount invoiced
      - `paid_amount` (numeric, default 0) - Amount paid
      - `created_at` (timestamp, default now())

    - `subscriptions`
      - `id` (uuid, primary key)
      - `customer_id` (text, not null) - Customer ID
      - `customer_name` (text, not null) - Customer name
      - `customer_email` (text, not null) - Customer email
      - `plan_name` (text, not null) - Subscription plan
      - `amount` (numeric, not null) - Subscription amount
      - `currency` (text, default 'USD') - Currency
      - `interval` (text, not null) - Billing interval
      - `status` (text, default 'active') - Subscription status
      - `start_date` (date, not null) - Start date
      - `end_date` (date, optional) - End date
      - `next_billing_date` (date, optional) - Next billing date
      - `payment_method` (text, optional) - Payment method
      - `created_at` (timestamp, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data

  3. Functions
    - Helper functions to create tables if they don't exist
*/

-- Create API Costs table
CREATE TABLE IF NOT EXISTS public.api_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  service text NOT NULL,
  cost numeric NOT NULL,
  period text NOT NULL,
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
  category text NOT NULL,
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
  status text DEFAULT 'lead' CHECK (status IN ('active', 'inactive', 'lead')),
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

-- Enable RLS on all tables
ALTER TABLE public.api_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

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

-- Create helper functions for table creation
CREATE OR REPLACE FUNCTION public.create_api_costs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.api_costs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider text NOT NULL,
    service text NOT NULL,
    cost numeric NOT NULL,
    period text NOT NULL,
    date date NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now()
  );
  
  ALTER TABLE public.api_costs ENABLE ROW LEVEL SECURITY;
  
  -- Create policies if they don't exist
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'api_costs' AND policyname = 'Allow authenticated users to read api costs'
    ) THEN
      CREATE POLICY "Allow authenticated users to read api costs"
        ON public.api_costs FOR SELECT TO authenticated USING (true);
    END IF;
  END $$;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_revenues_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.revenues (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source text NOT NULL,
    amount numeric NOT NULL,
    date date NOT NULL,
    description text,
    category text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
  
  ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_expenses_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category text NOT NULL,
    amount numeric NOT NULL,
    date date NOT NULL,
    description text,
    recurring boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );
  
  ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_clients_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    status text DEFAULT 'lead' CHECK (status IN ('active', 'inactive', 'lead')),
    notes text,
    created_at timestamptz DEFAULT now()
  );
  
  ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_jobs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid,
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
  
  ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
  
  -- Add foreign key constraint if clients table exists
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
      ALTER TABLE public.jobs 
      ADD CONSTRAINT jobs_client_id_fkey 
      FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
    END IF;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_subscriptions_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
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
  
  ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_costs_date ON public.api_costs(date);
CREATE INDEX IF NOT EXISTS idx_api_costs_provider ON public.api_costs(provider);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON public.revenues(date);
CREATE INDEX IF NOT EXISTS idx_revenues_category ON public.revenues(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON public.subscriptions(customer_id);