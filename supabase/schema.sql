-- Home Base — Supabase Schema
-- Run this in your Supabase SQL editor (Database > SQL Editor)

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text,
  category    text NOT NULL CHECK (category IN ('smart-home', 'subscriptions', 'water-hq', 'grocery', 'maintenance', 'other')),
  priority    text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'pending', 'closed')),
  author      text NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title      text NOT NULL,
  content    text NOT NULL DEFAULT '',
  pinned     boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security (open read/write since no real auth)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Allow all operations (family-only app, no sensitive data)
CREATE POLICY "allow_all_tickets" ON tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);

-- IMPORTANT: Enable real-time replication in Supabase dashboard:
-- Database > Replication > enable for both 'tickets' and 'announcements' tables
-- (or run the commands below)

-- Enable real-time for tickets
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;

-- Enable real-time for announcements
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
