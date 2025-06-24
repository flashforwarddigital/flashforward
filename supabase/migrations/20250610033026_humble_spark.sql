/*
  # Create Missing RPC Functions

  1. New Functions
    - create_subscriptions_table() - Creates the subscriptions table if it doesn't exist
    - create_clients_table() - Creates the clients table if it doesn't exist
    - create_jobs_table() - Creates the jobs table if it doesn't exist
    - create_expenses_table() - Creates the expenses table if it doesn't exist
    - create_revenues_table() - Creates the revenues table if it doesn't exist
    - create_api_costs_table() - Creates the api_costs table if it doesn't exist
  
  2. Security
    - All tables have RLS enabled
    - Appropriate policies are created for each table
*/

-- Create subscriptions table function
CREATE OR REPLACE FUNCTION public.create_subscriptions_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id text NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    plan_name text NOT NULL,
    amount numeric NOT NULL,
    currency text NOT NULL DEFAULT 'USD',
    interval text NOT NULL CHECK (interval IN ('month', 'year')),
    status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    next_billing_date timestamp with time zone,
    payment_method text
  );
  
  -- Enable RLS
  ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
  
  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' 
    AND policyname = 'Allow authenticated users to read subscriptions'
  ) THEN
    CREATE POLICY "Allow authenticated users to read subscriptions"
      ON public.subscriptions
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' 
    AND policyname = 'Allow authenticated users to insert subscriptions'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert subscriptions"
      ON public.subscriptions
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' 
    AND policyname = 'Allow authenticated users to update subscriptions'
  ) THEN
    CREATE POLICY "Allow authenticated users to update subscriptions"
      ON public.subscriptions
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' 
    AND policyname = 'Allow authenticated users to delete subscriptions'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete subscriptions"
      ON public.subscriptions
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

-- Create clients table function
CREATE OR REPLACE FUNCTION public.create_clients_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.clients (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    created_at timestamp with time zone DEFAULT now(),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
    notes text
  );
  
  -- Enable RLS
  ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
  
  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Allow authenticated users to read clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to read clients"
      ON public.clients
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Allow authenticated users to insert clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert clients"
      ON public.clients
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Allow authenticated users to update clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to update clients"
      ON public.clients
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Allow authenticated users to delete clients'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete clients"
      ON public.clients
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

-- Create jobs table function
CREATE OR REPLACE FUNCTION public.create_jobs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- First ensure clients table exists
  PERFORM create_clients_table();
  
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    due_date timestamp with time zone,
    status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'review', 'completed')),
    progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    assigned_to text[],
    budget numeric,
    invoiced_amount numeric DEFAULT 0,
    paid_amount numeric DEFAULT 0
  );
  
  -- Add foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'jobs_client_id_fkey' 
    AND conrelid = 'public.jobs'::regclass
  ) THEN
    ALTER TABLE public.jobs 
    ADD CONSTRAINT jobs_client_id_fkey 
    FOREIGN KEY (client_id) 
    REFERENCES public.clients(id) 
    ON DELETE CASCADE;
  END IF;
  
  -- Enable RLS
  ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
  
  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'jobs' 
    AND policyname = 'Allow authenticated users to read jobs'
  ) THEN
    CREATE POLICY "Allow authenticated users to read jobs"
      ON public.jobs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'jobs' 
    AND policyname = 'Allow authenticated users to insert jobs'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert jobs"
      ON public.jobs
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'jobs' 
    AND policyname = 'Allow authenticated users to update jobs'
  ) THEN
    CREATE POLICY "Allow authenticated users to update jobs"
      ON public.jobs
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'jobs' 
    AND policyname = 'Allow authenticated users to delete jobs'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete jobs"
      ON public.jobs
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

-- Create expenses table function
CREATE OR REPLACE FUNCTION public.create_expenses_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    category text NOT NULL,
    amount numeric NOT NULL,
    date timestamp with time zone NOT NULL,
    description text,
    recurring boolean DEFAULT false
  );
  
  -- Enable RLS
  ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
  
  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'expenses' 
    AND policyname = 'Allow authenticated users to read expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to read expenses"
      ON public.expenses
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'expenses' 
    AND policyname = 'Allow authenticated users to insert expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert expenses"
      ON public.expenses
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'expenses' 
    AND policyname = 'Allow authenticated users to update expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to update expenses"
      ON public.expenses
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'expenses' 
    AND policyname = 'Allow authenticated users to delete expenses'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete expenses"
      ON public.expenses
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

-- Create revenues table function
CREATE OR REPLACE FUNCTION public.create_revenues_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.revenues (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    source text NOT NULL,
    amount numeric NOT NULL,
    date timestamp with time zone NOT NULL,
    description text,
    category text NOT NULL
  );
  
  -- Enable RLS
  ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
  
  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'revenues' 
    AND policyname = 'Allow authenticated users to read revenues'
  ) THEN
    CREATE POLICY "Allow authenticated users to read revenues"
      ON public.revenues
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'revenues' 
    AND policyname = 'Allow authenticated users to insert revenues'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert revenues"
      ON public.revenues
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'revenues' 
    AND policyname = 'Allow authenticated users to update revenues'
  ) THEN
    CREATE POLICY "Allow authenticated users to update revenues"
      ON public.revenues
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'revenues' 
    AND policyname = 'Allow authenticated users to delete revenues'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete revenues"
      ON public.revenues
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

-- Create api_costs table function
CREATE OR REPLACE FUNCTION public.create_api_costs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.api_costs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider text NOT NULL,
    service text NOT NULL,
    cost numeric NOT NULL,
    period text NOT NULL,
    date timestamp with time zone NOT NULL,
    notes text
  );
  
  -- Enable RLS
  ALTER TABLE public.api_costs ENABLE ROW LEVEL SECURITY;
  
  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_costs' 
    AND policyname = 'Allow authenticated users to read api_costs'
  ) THEN
    CREATE POLICY "Allow authenticated users to read api_costs"
      ON public.api_costs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_costs' 
    AND policyname = 'Allow authenticated users to insert api_costs'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert api_costs"
      ON public.api_costs
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_costs' 
    AND policyname = 'Allow authenticated users to update api_costs'
  ) THEN
    CREATE POLICY "Allow authenticated users to update api_costs"
      ON public.api_costs
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'api_costs' 
    AND policyname = 'Allow authenticated users to delete api_costs'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete api_costs"
      ON public.api_costs
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;