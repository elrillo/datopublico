-- Tabla para Senadores
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

-- Tabla para Proyectos de Ley (Boletines)
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

-- Tabla para Sesiones (Unificada para ambas cámaras)
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

-- Habilitar RLS
alter table senadores enable row level security;
alter table proyectos_ley enable row level security;
alter table sesiones enable row level security;

-- Políticas de Lectura (Públicas)
create policy "Lectura pública de senadores" on senadores for select to anon, authenticated using (true);
create policy "Lectura pública de proyectos" on proyectos_ley for select to anon, authenticated using (true);
create policy "Lectura pública de sesiones" on sesiones for select to anon, authenticated using (true);

-- Políticas de Escritura (Solo Admin)
create policy "Escritura de senadores solo admin" on senadores for all to authenticated using (true) with check (true);
create policy "Escritura de proyectos solo admin" on proyectos_ley for all to authenticated using (true) with check (true);
create policy "Escritura de sesiones solo admin" on sesiones for all to authenticated using (true) with check (true);
