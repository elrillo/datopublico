-- Security Fixes Migration

-- 1. Fix RLS on contact_messages
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contact_messages') THEN
        ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Anon can insert contact messages" ON public.contact_messages;
        CREATE POLICY "Anon can insert contact messages" ON public.contact_messages
            FOR INSERT TO anon, authenticated WITH CHECK (true);
            
        DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
        CREATE POLICY "Admins can view contact messages" ON public.contact_messages
            FOR SELECT TO authenticated USING (
                -- Simple check for authenticated, assuming role management handles granular access
                -- Or ideally: public.has_role(auth.uid(), 'admin')
                -- For safety in this migration, we'll check against profiles or just allow auth for now if has_role fails recursion
                EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
            );
    END IF;
END $$;

-- 2. Fix RLS on estudios (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'estudios') THEN
        ALTER TABLE public.estudios ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Public read access" ON public.estudios;
        CREATE POLICY "Public read access" ON public.estudios
            FOR SELECT USING (true);
            
        DROP POLICY IF EXISTS "Admin write access" ON public.estudios;
        CREATE POLICY "Admin write access" ON public.estudios
            FOR ALL TO authenticated USING (
                EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
            );
    END IF;
END $$;

-- 3. Fix Mutable Search Path in Security Definer Functions
-- It is best practice to set a fixed search_path for SECURITY DEFINER functions to prevent hijacking.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Default role
  );
  return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.is_active_member(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
  expires_at timestamptz;
BEGIN
  SELECT role, membership_expires_at INTO user_role, expires_at
  FROM public.profiles
  WHERE id = user_id;

  -- Staff always active
  IF user_role IN ('admin', 'editor', 'writer') THEN
    RETURN true;
  END IF;

  -- Members active if role is member AND (no expiration OR expiration in future)
  IF user_role = 'member' THEN
    IF expires_at IS NULL OR expires_at > now() THEN
      RETURN true;
    END IF;
  END IF;

  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = user_id;
  
  if user_role = 'admin' then
    return true; -- Admin has access to everything
  elsif required_role = 'admin' then
    return false;
  elsif user_role = 'editor' and required_role in ('editor', 'writer', 'user') then
    return true;
  elsif user_role = 'writer' and required_role in ('writer', 'user') then
    return true;
  elsif user_role = 'user' and required_role = 'user' then
    return true;
  else
    return false;
  end if;
end;
$$;
