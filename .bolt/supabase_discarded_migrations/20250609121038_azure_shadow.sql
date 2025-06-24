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

-- Enable RLS on all tables
ALTER TABLE public.api_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

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

-- Create helper functions for table creation
CREATE OR REPLACE FUNCTION public.create_api_costs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since the table already exists
  -- But we keep it to satisfy the application's expectations
  RAISE NOTICE 'API costs table already exists';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_revenues_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since the table already exists
  RAISE NOTICE 'Revenues table already exists';
END;
$$;

CREATE OR REPLACE FUNCTION public.create_expenses_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function is now a no-op since the table already exists
  RAISE NOTICE 'Expenses table already exists';
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_costs_date ON public.api_costs(date);
CREATE INDEX IF NOT EXISTS idx_api_costs_provider ON public.api_costs(provider);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON public.revenues(date);
CREATE INDEX IF NOT EXISTS idx_revenues_category ON public.revenues(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);