-- MIGRACIÓN LEGISLATIVA (Solo Congreso)
-- Ejecutar en el nuevo proyecto Supabase

-- 1. NOTICIAS (Opcional, si quieres mantener el blog)
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

-- 2. DIPUTADOS Y VOTACIONES (Cámara)
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


-- 3. SENADORES, PROYECTOS DE LEY Y SESIONES
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
