-- Agregar columna faltante updated_at a votaciones_sala
alter table votaciones_sala 
add column if not exists updated_at timestamptz default now();
