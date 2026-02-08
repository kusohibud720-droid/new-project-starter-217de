-- Drop existing policies
DROP POLICY IF EXISTS "Allow service role full access to tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow service role full access to telegram_users" ON public.telegram_users;

-- Create proper RLS policies for tasks table
-- Only service role (used by edge functions) can access
CREATE POLICY "Service role can manage tasks"
ON public.tasks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Block all access from anon/authenticated users (web app doesn't use these tables directly)
CREATE POLICY "Deny public access to tasks"
ON public.tasks
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Create proper RLS policies for telegram_users table
CREATE POLICY "Service role can manage telegram_users"
ON public.telegram_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Block all access from anon/authenticated users
CREATE POLICY "Deny public access to telegram_users"
ON public.telegram_users
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);