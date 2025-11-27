-- Tabla para Noticias (Web Backend)

create table if not exists noticias (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  slug text not null unique,
  content text,
  published_at timestamptz,
  image_url text,
  is_published boolean default false
);

-- Habilitar Row Level Security (RLS)
alter table noticias enable row level security;

-- Política de Lectura: Pública para todos
create policy "Lectura pública de noticias"
on noticias for select
to anon, authenticated
using (true);

-- Política de Escritura: Solo usuarios autenticados (Admin)
create policy "Escritura de noticias solo para admins"
on noticias for all
to authenticated
using (true)
with check (true);
