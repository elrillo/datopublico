-- Tabla para Datos de MercadoPúblico (Consumo de API)
-- Actualizado para incluir código único y evitar duplicados

create table if not exists datos_mercadopublico (
  id uuid default gen_random_uuid() primary key,
  codigo text unique not null, -- Código de la Orden de Compra (ej: "123-456-SE23")
  fecha date not null,
  organismo text,
  monto numeric,
  moneda text, -- CLP, USD, etc.
  estado text, -- Enviada a Proveedor, Aceptada, etc.
  tipo text, -- Orden de Compra
  descripcion text,
  sector text,
  created_at timestamptz default now()
);

-- Habilitar Row Level Security (RLS)
alter table datos_mercadopublico enable row level security;

-- Política de Lectura: Pública para todos
create policy "Lectura pública de datos mercadopublico"
on datos_mercadopublico for select
to anon, authenticated
using (true);

-- Política de Escritura: Solo usuarios autenticados (Admin o Service Role)
create policy "Escritura de datos solo para admins"
on datos_mercadopublico for all
to authenticated
using (true)
with check (true);
