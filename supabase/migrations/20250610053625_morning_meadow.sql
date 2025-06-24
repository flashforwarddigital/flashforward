/*
  # Create analytics tables

  1. New Tables
    - `analytics_page_views` - Tracks page views
    - `analytics_clicks` - Tracks user clicks
    - `analytics_visit_duration` - Tracks time spent on pages
  
  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous and authenticated users
*/

-- Create analytics_page_views table
CREATE TABLE IF NOT EXISTS public.analytics_page_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text,
  user_agent text,
  referrer text,
  ip_address text
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON public.analytics_page_views (timestamp);

-- Enable RLS
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_page_views' 
    AND policyname = 'Enable insert access for anonymous users'
  ) THEN
    CREATE POLICY "Enable insert access for anonymous users"
      ON public.analytics_page_views
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_page_views' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON public.analytics_page_views
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create analytics_clicks table
CREATE TABLE IF NOT EXISTS public.analytics_clicks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  element text NOT NULL,
  page text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text,
  element_type text,
  element_text text,
  element_class text,
  element_id text
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON public.analytics_clicks (timestamp);

-- Enable RLS
ALTER TABLE public.analytics_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_clicks' 
    AND policyname = 'Enable insert access for anonymous users'
  ) THEN
    CREATE POLICY "Enable insert access for anonymous users"
      ON public.analytics_clicks
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_clicks' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON public.analytics_clicks
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create analytics_visit_duration table
CREATE TABLE IF NOT EXISTS public.analytics_visit_duration (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  duration integer NOT NULL,
  page text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text,
  is_bounce boolean DEFAULT false
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visit_duration_timestamp ON public.analytics_visit_duration (timestamp);

-- Enable RLS
ALTER TABLE public.analytics_visit_duration ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_visit_duration' 
    AND policyname = 'Enable insert access for anonymous users'
  ) THEN
    CREATE POLICY "Enable insert access for anonymous users"
      ON public.analytics_visit_duration
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analytics_visit_duration' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users"
      ON public.analytics_visit_duration
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create analytics_summary view
CREATE OR REPLACE VIEW public.analytics_summary AS
SELECT
  DATE_TRUNC('day', pv.timestamp) AS date,
  COUNT(DISTINCT pv.session_id) AS unique_visitors,
  COUNT(pv.id) AS total_page_views,
  COALESCE(AVG(vd.duration), 0) AS avg_duration
FROM
  public.analytics_page_views pv
LEFT JOIN
  public.analytics_visit_duration vd ON pv.session_id = vd.session_id
GROUP BY
  DATE_TRUNC('day', pv.timestamp)
ORDER BY
  date DESC;