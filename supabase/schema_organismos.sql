-- Tabla para Organismos Públicos (Compradores)
create table if not exists organismos (
  codigo text primary key, -- Código del organismo (ej: "708")
  nombre text not null,
  sector text,
  created_at timestamptz default now()
);

alter table organismos enable row level security;

create policy "Lectura pública de organismos"
on organismos for select
to anon, authenticated
using (true);

create policy "Escritura de organismos solo para admins"
on organismos for all
to authenticated
using (true)
with check (true);
