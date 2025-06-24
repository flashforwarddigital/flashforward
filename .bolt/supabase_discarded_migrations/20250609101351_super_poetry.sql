-- Drop countdown_timers table if it exists
DROP TABLE IF EXISTS public.countdown_timers;

-- Drop the create_countdown_timers_table function if it exists
DROP FUNCTION IF EXISTS public.create_countdown_timers_table();

-- Create images bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('images', 'images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create policies for images bucket
DO $$
BEGIN
  -- Allow public read access to images bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Public Read Access for images' AND bucket_id = 'images'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Public Read Access for images',
      'images',
      '{"name":"Public Read Access for images","owner":null,"resource":"object","action":"read","roles":["anon"],"condition":null}'::jsonb
    );
  END IF;

  -- Allow authenticated users to upload to images bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Authenticated Upload Access for images' AND bucket_id = 'images'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Authenticated Upload Access for images',
      'images',
      '{"name":"Authenticated Upload Access for images","owner":"auth.uid()","resource":"object","action":"insert","roles":["authenticated"],"condition":null}'::jsonb
    );
  END IF;
END $$;

-- Create functions for creating tables programmatically
CREATE OR REPLACE FUNCTION public.create_clients_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'clients'
  ) THEN
    CREATE TABLE public.clients (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      phone text,
      company text,
      created_at timestamptz DEFAULT now(),
      status text DEFAULT 'active',
      notes text
    );

    -- Enable RLS
    ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow authenticated users to read clients"
      ON public.clients FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to insert clients"
      ON public.clients FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated users to update clients"
      ON public.clients FOR UPDATE
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to delete clients"
      ON public.clients FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_jobs_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'jobs'
  ) THEN
    CREATE TABLE public.jobs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text,
      created_at timestamptz DEFAULT now(),
      due_date timestamptz,
      status text DEFAULT 'not_started',
      progress integer DEFAULT 0,
      assigned_to text[],
      budget numeric,
      invoiced_amount numeric DEFAULT 0,
      paid_amount numeric DEFAULT 0
    );

    -- Enable RLS
    ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow authenticated users to read jobs"
      ON public.jobs FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to insert jobs"
      ON public.jobs FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated users to update jobs"
      ON public.jobs FOR UPDATE
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to delete jobs"
      ON public.jobs FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_subscriptions_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions'
  ) THEN
    CREATE TABLE public.subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id text NOT NULL,
      customer_name text NOT NULL,
      customer_email text NOT NULL,
      plan_name text NOT NULL,
      amount numeric NOT NULL,
      currency text DEFAULT 'USD',
      interval text DEFAULT 'month',
      status text DEFAULT 'active',
      start_date timestamptz NOT NULL,
      end_date timestamptz,
      next_billing_date timestamptz,
      payment_method text
    );

    -- Enable RLS
    ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow authenticated users to read subscriptions"
      ON public.subscriptions FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to insert subscriptions"
      ON public.subscriptions FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated users to update subscriptions"
      ON public.subscriptions FOR UPDATE
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to delete subscriptions"
      ON public.subscriptions FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_api_costs_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'api_costs'
  ) THEN
    CREATE TABLE public.api_costs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      provider text NOT NULL,
      service text NOT NULL,
      cost numeric NOT NULL,
      period text DEFAULT 'monthly',
      date date NOT NULL,
      notes text
    );

    -- Enable RLS
    ALTER TABLE public.api_costs ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow authenticated users to read api_costs"
      ON public.api_costs FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to insert api_costs"
      ON public.api_costs FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated users to update api_costs"
      ON public.api_costs FOR UPDATE
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to delete api_costs"
      ON public.api_costs FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_revenues_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'revenues'
  ) THEN
    CREATE TABLE public.revenues (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      source text NOT NULL,
      amount numeric NOT NULL,
      date date NOT NULL,
      description text,
      category text DEFAULT 'subscription'
    );

    -- Enable RLS
    ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow authenticated users to read revenues"
      ON public.revenues FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to insert revenues"
      ON public.revenues FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated users to update revenues"
      ON public.revenues FOR UPDATE
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to delete revenues"
      ON public.revenues FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_expenses_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'expenses'
  ) THEN
    CREATE TABLE public.expenses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      category text NOT NULL,
      amount numeric NOT NULL,
      date date NOT NULL,
      description text,
      recurring boolean DEFAULT false
    );

    -- Enable RLS
    ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow authenticated users to read expenses"
      ON public.expenses FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to insert expenses"
      ON public.expenses FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Allow authenticated users to update expenses"
      ON public.expenses FOR UPDATE
      TO authenticated
      USING (true);

    CREATE POLICY "Allow authenticated users to delete expenses"
      ON public.expenses FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END;
$$;