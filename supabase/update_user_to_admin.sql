-- Reemplaza 'tu_correo@gmail.com' con el correo con el que iniciaste sesión
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'tu_correo@gmail.com';

-- O si eres el único usuario o el último que se registró, puedes usar esto:
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1
);
