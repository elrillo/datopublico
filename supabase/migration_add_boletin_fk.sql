-- Agregar columna boletin (FK) a votaciones_sala
-- Permitimos nulos por si hay votaciones de otros temas, pero idealmente FK
alter table votaciones_sala 
add column if not exists boletin text references proyectos_ley(boletin);

-- Índice para busquedas rapidas
create index if not exists idx_votaciones_boletin on votaciones_sala(boletin);
