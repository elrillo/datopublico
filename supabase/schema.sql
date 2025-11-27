-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tabla Noticias
create table if not exists noticias (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  slug text unique not null,
  content text,
  published_at timestamptz,
  image_url text,
  is_published boolean default false
);

-- Tabla Datos MercadoPublico
create table if not exists datos_mercadopublico (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  organismo text not null,
  monto numeric,
  tipo text,
  descripcion text,
  sector text
);

-- RLS Policies (Security)
alter table noticias enable row level security;
alter table datos_mercadopublico enable row level security;

-- Public Read Access
create policy "Public Read Noticias" on noticias
  for select using (true);

create policy "Public Read Datos" on datos_mercadopublico
  for select using (true);

-- Admin Write Access (Assuming authenticated users are admins for MVP)
-- In a real app, you'd check for a specific role or email.
create policy "Admin Insert Noticias" on noticias
  for insert with check (auth.role() = 'authenticated');

create policy "Admin Update Noticias" on noticias
  for update using (auth.role() = 'authenticated');

create policy "Admin Delete Noticias" on noticias
  for delete using (auth.role() = 'authenticated');

-- Same for Datos (if admin needs to edit manually)
create policy "Admin Write Datos" on datos_mercadopublico
  for all using (auth.role() = 'authenticated');
