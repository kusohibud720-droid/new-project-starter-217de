-- Revoke default public privileges from anon role
REVOKE ALL ON public.tasks FROM anon;
REVOKE ALL ON public.telegram_users FROM anon;

-- Also revoke from authenticated since these tables are only accessed via service role
REVOKE ALL ON public.tasks FROM authenticated;
REVOKE ALL ON public.telegram_users FROM authenticated;

-- Grant full access to service_role
GRANT ALL ON public.tasks TO service_role;
GRANT ALL ON public.telegram_users TO service_role;