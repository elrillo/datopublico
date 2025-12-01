-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id int PRIMARY KEY DEFAULT 1,
    site_name text DEFAULT 'DatoPúblico',
    site_description text,
    contact_email text,
    social_twitter text,
    social_instagram text,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row if not exists
INSERT INTO public.site_settings (id, site_name)
VALUES (1, 'DatoPúblico')
ON CONFLICT (id) DO NOTHING;

-- RLS for Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read settings" ON public.site_settings;
CREATE POLICY "Allow public read settings" ON public.site_settings
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin update settings" ON public.site_settings;
CREATE POLICY "Allow admin update settings" ON public.site_settings
FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- 2. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL, -- 'create', 'update', 'delete'
    entity text NOT NULL, -- 'news', 'user', 'settings'
    entity_id text,
    details jsonb,
    created_at timestamptz DEFAULT now()
);

-- RLS for Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admins to view logs" ON public.audit_logs;
CREATE POLICY "Allow admins to view logs" ON public.audit_logs
FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

DROP POLICY IF EXISTS "Allow authenticated users to insert logs" ON public.audit_logs;
CREATE POLICY "Allow authenticated users to insert logs" ON public.audit_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Storage Policies for 'images' bucket
-- Attempt to create bucket if it doesn't exist (this might fail if extension not enabled, but usually works in standard projects)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
