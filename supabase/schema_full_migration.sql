-- MIGRACIÓN COMPLETA PARA NUEVO PROYECTO SUPABASE
-- Ejecutar todo este script en el SQL Editor del nuevo proyecto.

-- 1. NOTICIAS (Web Backend)
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

alter table noticias enable row level security;

create policy "Lectura pública de noticias" on noticias for select to anon, authenticated using (true);
create policy "Escritura de noticias solo para admins" on noticias for all to authenticated using (true) with check (true);


-- 2. DATOS MERCADO PÚBLICO (Órdenes de Compra)
create table if not exists datos_mercadopublico (
  id uuid default gen_random_uuid() primary key,
  codigo text unique not null, -- Código de la Orden de Compra
  fecha date not null,
  organismo text,
  monto numeric,
  moneda text,
  estado text,
  tipo text,
  descripcion text,
  sector text,
  proveedor_rut text,   -- Agregado en migración v1
  proveedor_nombre text, -- Agregado en migración v1
  created_at timestamptz default now()
);

alter table datos_mercadopublico enable row level security;

create policy "Lectura pública de datos mercadopublico" on datos_mercadopublico for select to anon, authenticated using (true);
create policy "Escritura de datos solo para admins" on datos_mercadopublico for all to authenticated using (true) with check (true);


-- 3. LICITACIONES Y PROVEEDORES
create table if not exists licitaciones (
  id uuid default gen_random_uuid() primary key,
  codigo text unique not null,
  nombre text,
  estado text,
  comprador_nombre text,
  comprador_codigo text,
  fecha_publicacion timestamptz,
  fecha_cierre timestamptz,
  moneda text,
  monto_estimado numeric,
  tipo text,
  created_at timestamptz default now()
);

alter table licitaciones enable row level security;

create policy "Lectura pública de licitaciones" on licitaciones for select to anon, authenticated using (true);
create policy "Escritura de licitaciones solo para admins" on licitaciones for all to authenticated using (true) with check (true);

create table if not exists proveedores (
  id uuid default gen_random_uuid() primary key,
  rut text unique not null,
  nombre text not null,
  rubro text,
  tamano text,
  created_at timestamptz default now()
);

alter table proveedores enable row level security;

create policy "Lectura pública de proveedores" on proveedores for select to anon, authenticated using (true);
create policy "Escritura de proveedores solo para admins" on proveedores for all to authenticated using (true) with check (true);


-- 4. ORGANISMOS PÚBLICOS
create table if not exists organismos (
  codigo text primary key,
  nombre text not null,
  sector text,
  created_at timestamptz default now()
);

alter table organismos enable row level security;

create policy "Lectura pública de organismos" on organismos for select to anon, authenticated using (true);
create policy "Escritura de organismos solo para admins" on organismos for all to authenticated using (true) with check (true);


-- 5. DIPUTADOS Y VOTACIONES (Cámara)
create table if not exists diputados (
  id integer primary key,
  nombre text not null,
  apellido_paterno text,
  apellido_materno text,
  partido text,
  distrito text,
  url_foto text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists votaciones_sala (
  id integer primary key,
  fecha timestamptz,
  materia text,
  resultado text,
  created_at timestamptz default now()
);

alter table diputados enable row level security;
alter table votaciones_sala enable row level security;

create policy "Lectura pública de diputados" on diputados for select to anon, authenticated using (true);
create policy "Lectura pública de votaciones" on votaciones_sala for select to anon, authenticated using (true);
create policy "Escritura de diputados solo admin" on diputados for all to authenticated using (true) with check (true);
create policy "Escritura de votaciones solo admin" on votaciones_sala for all to authenticated using (true) with check (true);


-- 6. SENADORES, PROYECTOS DE LEY Y SESIONES
create table if not exists senadores (
  id integer primary key,
  nombre text not null,
  apellido_paterno text,
  apellido_materno text,
  partido text,
  region text,
  circunscripcion text,
  email text,
  telefono text,
  url_foto text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists proyectos_ley (
  boletin text primary key,
  titulo text,
  fecha_ingreso date,
  iniciativa text,
  camara_origen text,
  urgencia_actual text,
  etapa text,
  link_tramitacion text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists sesiones (
  id text primary key,
  camara text not null,
  numero integer,
  legislatura integer,
  fecha timestamptz,
  tipo text,
  tabla text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table senadores enable row level security;
alter table proyectos_ley enable row level security;
alter table sesiones enable row level security;

create policy "Lectura pública de senadores" on senadores for select to anon, authenticated using (true);
create policy "Lectura pública de proyectos" on proyectos_ley for select to anon, authenticated using (true);
create policy "Lectura pública de sesiones" on sesiones for select to anon, authenticated using (true);

create policy "Escritura de senadores solo admin" on senadores for all to authenticated using (true) with check (true);
create policy "Escritura de proyectos solo admin" on proyectos_ley for all to authenticated using (true) with check (true);
create policy "Escritura de sesiones solo admin" on sesiones for all to authenticated using (true) with check (true);
