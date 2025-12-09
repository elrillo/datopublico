-- MIGRACIÓN CARGA HISTÓRICA LEGISLATIVA
-- Ejecutar en SQL Editor de Supabase (Proyecto Legislativo)

-- 1. Nuevas Tablas de Dimensión y Hecho

create table if not exists dim_comisiones (
  id text primary key, -- Generated ID or Composite "CAM-123"
  nombre text not null,
  tipo text,
  camara text not null, -- 'Diputados' o 'Senado'
  correo text,
  integrantes_json jsonb, -- Snapshot de integrantes al momento de carga
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists fact_diario_sesion (
  id uuid default gen_random_uuid() primary key,
  sesion_id text not null references sesiones(id), -- FK a tabla sesiones
  seccion text, -- 'Asistencia', 'Cuenta', 'OrdenDelDia', 'Incidentes'
  contenido text, -- Texto plano o resumen
  contenido_raw jsonb, -- Estructura cruda XML/JSON por si acaso
  created_at timestamptz default now()
);

create table if not exists fact_votaciones_detalle (
  id uuid default gen_random_uuid() primary key,
  votacion_id integer not null, -- FK a votaciones_sala (si existe, sino referencia lógica)
  parlamentario_id integer not null, -- FK a diputados o senadores (id unificado sería ideal, pero por ahora son separados)
  camara text not null, -- 'Diputados' o 'Senado'
  nombre_parlamentario text, -- Redundancia útil para DWH
  opcion_voto text, -- 'A Favor', 'En Contra', 'Abstencion', 'Pareo'
  created_at timestamptz default now()
);

-- 2. Modificaciones a Tablas Existentes (Robustez)

-- Agregar flag de error de API a Proyectos
alter table proyectos_ley 
add column if not exists api_error_flag boolean default false,
add column if not exists resumen text;

-- Agregar flag de error a Sesiones
alter table sesiones
add column if not exists api_error_flag boolean default false;

-- Asegurar que Votaciones tenga flag
alter table votaciones_sala
add column if not exists api_error_flag boolean default false,
add column if not exists quorum text,
add column if not exists tipo_votacion text;

-- 3. Políticas RLS para las nuevas tablas
alter table dim_comisiones enable row level security;
alter table fact_diario_sesion enable row level security;
alter table fact_votaciones_detalle enable row level security;

-- Lectura pública
create policy "Lectura pública de comisiones" on dim_comisiones for select to anon, authenticated using (true);
create policy "Lectura pública de diarios" on fact_diario_sesion for select to anon, authenticated using (true);
create policy "Lectura pública de detalle votos" on fact_votaciones_detalle for select to anon, authenticated using (true);

-- Escritura admin
create policy "Escritura comisiones admin" on dim_comisiones for all to authenticated using (true) with check (true);
create policy "Escritura diarios admin" on fact_diario_sesion for all to authenticated using (true) with check (true);
create policy "Escritura detalle votos admin" on fact_votaciones_detalle for all to authenticated using (true) with check (true);
