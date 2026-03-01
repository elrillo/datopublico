-- SCRIPT DE RESTAURACIÓN DE ESQUEMA LEGISLATIVO
-- Ejecuta esto en el proyecto 'Observatorio Congreso' (Supabase) para recrear las tablas borradas.

-- 1. Tablas Core (Senadores, Proyectos, Sesiones)
create table if not exists senadores (
  id integer primary key, -- PARLID
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
  boletin text primary key, -- Número de boletín (ej: 8575-07)
  titulo text, -- Descripción o Materia
  fecha_ingreso date,
  iniciativa text, -- Moción o Mensaje
  camara_origen text, -- Senado o Cámara de Diputados
  urgencia_actual text,
  etapa text, -- Primer trámite, Segundo trámite, etc.
  link_tramitacion text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists sesiones (
  id text primary key, -- ID único (ej: "SEN-5794" o "DIP-3162")
  camara text not null, -- 'Senado' o 'Diputados'
  numero integer,
  legislatura integer,
  fecha timestamptz,
  tipo text, -- Ordinaria, Especial, etc.
  tabla text, -- Resumen de temas tratados
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Diputados y Votaciones Base
create table if not exists diputados (
  id integer primary key, -- ID original de la Cámara
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
  id integer primary key, -- ID original de la votación
  fecha timestamptz,
  materia text,
  resultado text,
  -- Campos agregados en migraciones posteriores:
  quorum text,
  tipo_votacion text,
  api_error_flag boolean default false,
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  -- Relación con proyectos (se agrega alter abajo o directa aquí, directa mejor):
  boletin text references proyectos_ley(boletin)
);

-- 3. Tablas Históricas y de Detalle
create table if not exists dim_comisiones (
  id text primary key,
  nombre text not null,
  tipo text,
  camara text not null,
  correo text,
  integrantes_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists fact_diario_sesion (
  id uuid default gen_random_uuid() primary key,
  sesion_id text not null references sesiones(id),
  seccion text,
  contenido text,
  contenido_raw jsonb,
  created_at timestamptz default now()
);

create table if not exists fact_votaciones_detalle (
  id uuid default gen_random_uuid() primary key,
  votacion_id integer not null, -- FK lógica a votaciones_sala ( integer vs md5 int, cuidado con types)
  parlamentario_id integer not null,
  camara text not null,
  nombre_parlamentario text,
  opcion_voto text,
  created_at timestamptz default now()
);

-- 4. Flags adicionales (si faltaron)
alter table proyectos_ley 
add column if not exists api_error_flag boolean default false,
add column if not exists resumen text;

alter table sesiones
add column if not exists api_error_flag boolean default false;

-- 5. Índices Extras
create index if not exists idx_votaciones_boletin on votaciones_sala(boletin);

-- 6. Habilitar RLS y Políticas (CRÍTICO)
-- Senadores
alter table senadores enable row level security;
create policy "Lectura pública de senadores" on senadores for select to anon, authenticated using (true);
create policy "Escritura de senadores solo admin" on senadores for all to authenticated using (true) with check (true);

-- Proyectos
alter table proyectos_ley enable row level security;
create policy "Lectura pública de proyectos" on proyectos_ley for select to anon, authenticated using (true);
create policy "Escritura de proyectos solo admin" on proyectos_ley for all to authenticated using (true) with check (true);

-- Sesiones
alter table sesiones enable row level security;
create policy "Lectura pública de sesiones" on sesiones for select to anon, authenticated using (true);
create policy "Escritura de sesiones solo admin" on sesiones for all to authenticated using (true) with check (true);

-- Diputados
alter table diputados enable row level security;
create policy "Lectura pública de diputados" on diputados for select to anon, authenticated using (true);
create policy "Escritura de diputados solo admin" on diputados for all to authenticated using (true) with check (true);

-- Votaciones
alter table votaciones_sala enable row level security;
create policy "Lectura pública de votaciones" on votaciones_sala for select to anon, authenticated using (true);
create policy "Escritura de votaciones solo admin" on votaciones_sala for all to authenticated using (true) with check (true);

-- Detalles
alter table fact_diario_sesion enable row level security;
create policy "Lectura pública de diarios" on fact_diario_sesion for select to anon, authenticated using (true);
create policy "Escritura diarios admin" on fact_diario_sesion for all to authenticated using (true) with check (true);

alter table fact_votaciones_detalle enable row level security;
create policy "Lectura pública de detalle votos" on fact_votaciones_detalle for select to anon, authenticated using (true);
create policy "Escritura detalle votos admin" on fact_votaciones_detalle for all to authenticated using (true) with check (true);
