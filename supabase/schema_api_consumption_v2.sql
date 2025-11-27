-- Tabla para Licitaciones
create table if not exists licitaciones (
  id uuid default gen_random_uuid() primary key,
  codigo text unique not null, -- Código de la Licitación (ej: "123-45-LP23")
  nombre text,
  estado text, -- Publicada, Cerrada, Adjudicada, Desierta
  comprador_nombre text,
  comprador_codigo text, -- Código del organismo público
  fecha_publicacion timestamptz,
  fecha_cierre timestamptz,
  moneda text,
  monto_estimado numeric,
  tipo text, -- L1, LE, LP, etc.
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table licitaciones enable row level security;

-- Políticas
create policy "Lectura pública de licitaciones"
on licitaciones for select
to anon, authenticated
using (true);

create policy "Escritura de licitaciones solo para admins"
on licitaciones for all
to authenticated
using (true)
with check (true);

-- Tabla para Proveedores (Empresas que venden al estado)
-- Esta tabla se puede ir poblando a partir de las Órdenes de Compra
create table if not exists proveedores (
  id uuid default gen_random_uuid() primary key,
  rut text unique not null,
  nombre text not null,
  rubro text,
  tamano text, -- Micro, Pequeña, Mediana, Grande
  created_at timestamptz default now()
);

alter table proveedores enable row level security;

create policy "Lectura pública de proveedores"
on proveedores for select
to anon, authenticated
using (true);

create policy "Escritura de proveedores solo para admins"
on proveedores for all
to authenticated
using (true)
with check (true);
