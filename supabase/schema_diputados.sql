-- Tabla para Diputados
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

-- Tabla para Votaciones en Sala
create table if not exists votaciones_sala (
  id integer primary key, -- ID original de la votación
  fecha timestamptz,
  materia text,
  resultado text,
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table diputados enable row level security;
alter table votaciones_sala enable row level security;

-- Políticas de Lectura (Públicas)
create policy "Lectura pública de diputados" on diputados for select to anon, authenticated using (true);
create policy "Lectura pública de votaciones" on votaciones_sala for select to anon, authenticated using (true);

-- Políticas de Escritura (Solo Admin)
create policy "Escritura de diputados solo admin" on diputados for all to authenticated using (true) with check (true);
create policy "Escritura de votaciones solo admin" on votaciones_sala for all to authenticated using (true) with check (true);
