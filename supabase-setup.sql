-- Create tickets table in Supabase
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/kjryedtwzqpsnfrtghtk/sql

CREATE TABLE IF NOT EXISTS public.tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'closed')),
    category TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    subject TEXT,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    company_email TEXT,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_user_email ON public.tickets(user_email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read all tickets (global visibility)
CREATE POLICY "Allow all users to read all tickets"
ON public.tickets
FOR SELECT
TO public
USING (true);

-- Create policy to allow authenticated users to insert tickets
CREATE POLICY "Allow all users to insert tickets"
ON public.tickets
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow users to update tickets
CREATE POLICY "Allow all users to update tickets"
ON public.tickets
FOR UPDATE
TO public
USING (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.tickets TO anon;
GRANT ALL ON public.tickets TO authenticated;
