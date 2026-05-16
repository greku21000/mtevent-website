-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

create table if not exists inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  event_type text not null,
  event_date date,
  guest_count integer,
  venue text,
  message text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table inquiries enable row level security;

-- Allow inserts from anonymous (API route uses service role key, so this is fine)
create policy "Allow insert" on inquiries for insert with check (true);

-- Only service role can read
create policy "Service role only" on inquiries for select using (false);
