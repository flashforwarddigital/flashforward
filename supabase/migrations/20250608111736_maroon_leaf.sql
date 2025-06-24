/*
  # Add Chat Tables

  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable)
      - `created_at` (timestamp with time zone)
    - `chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `role` (text)
      - `content` (text)
      - `created_at` (timestamp with time zone)
  2. Security
    - Enable RLS on both tables
    - Add policies for public access
*/

-- Create chat_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create chat_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id),
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_sessions
CREATE POLICY "Allow insert for anonymous users" ON chat_sessions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users" ON chat_sessions
  FOR SELECT TO authenticated
  USING (true);

-- Create policies for chat_messages
CREATE POLICY "Allow insert for anonymous users" ON chat_messages
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users" ON chat_messages
  FOR SELECT TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);