-- 1. Crear la tabla de noticias si no existe
create table if not exists public.noticias (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  slug text not null unique,
  content text,
  published_at timestamptz,
  image_url text,
  is_published boolean default false
);

-- 2. Habilitar RLS
alter table public.noticias enable row level security;

-- 3. Política de Lectura: Pública para todos
-- Primero borramos si existe para evitar conflictos al recrear
drop policy if exists "Lectura pública de noticias" on public.noticias;

create policy "Lectura pública de noticias"
on public.noticias for select
to anon, authenticated
using (true);

-- 4. Política de Escritura: Basada en Roles (Admin, Editor, Writer)
-- Borramos políticas antiguas
drop policy if exists "Escritura de noticias solo para admins" on public.noticias;
drop policy if exists "Gestión de noticias para staff" on public.noticias;

-- Creamos la nueva política que usa la función has_role
create policy "Gestión de noticias para staff"
on public.noticias for all
to authenticated
using (public.has_role(auth.uid(), 'writer'))
with check (public.has_role(auth.uid(), 'writer'));
