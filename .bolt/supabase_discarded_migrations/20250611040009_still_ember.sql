/*
  # Create analytics tables

  1. New Tables
    - `analytics_page_views` - Stores page view data
    - `analytics_clicks` - Stores click event data
    - `analytics_visit_duration` - Stores visit duration data
  
  2. Security
    - Enable RLS on all tables
    - Add policies for service role to insert data
    - Add policies for authenticated users to read data
*/

-- Create analytics_page_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text,
  user_agent text,
  referrer text,
  ip_address text
);

-- Create analytics_clicks table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics_clicks (
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

-- Create analytics_visit_duration table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics_visit_duration (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  duration integer NOT NULL,
  page text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text,
  is_bounce boolean DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_visit_duration ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_page_views
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_page_views' AND policyname = 'Allow service role to insert page views'
  ) THEN
    CREATE POLICY "Allow service role to insert page views"
      ON analytics_page_views
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_page_views' AND policyname = 'Allow authenticated users to read page views'
  ) THEN
    CREATE POLICY "Allow authenticated users to read page views"
      ON analytics_page_views
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create policies for analytics_clicks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_clicks' AND policyname = 'Allow service role to insert clicks'
  ) THEN
    CREATE POLICY "Allow service role to insert clicks"
      ON analytics_clicks
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_clicks' AND policyname = 'Allow authenticated users to read clicks'
  ) THEN
    CREATE POLICY "Allow authenticated users to read clicks"
      ON analytics_clicks
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create policies for analytics_visit_duration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_visit_duration' AND policyname = 'Allow service role to insert visit duration'
  ) THEN
    CREATE POLICY "Allow service role to insert visit duration"
      ON analytics_visit_duration
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_visit_duration' AND policyname = 'Allow authenticated users to read visit duration'
  ) THEN
    CREATE POLICY "Allow authenticated users to read visit duration"
      ON analytics_visit_duration
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON analytics_page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON analytics_page_views(page);

CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON analytics_clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_clicks_session_id ON analytics_clicks(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_clicks_page ON analytics_clicks(page);

CREATE INDEX IF NOT EXISTS idx_visit_duration_timestamp ON analytics_visit_duration(timestamp);

-- Add anonymous access for inserting analytics data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_visit_duration' AND policyname = 'Enable insert access for anonymous users'
  ) THEN
    CREATE POLICY "Enable insert access for anonymous users"
      ON analytics_visit_duration
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END
$$;