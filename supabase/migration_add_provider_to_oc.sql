-- Agregar columnas de proveedor a la tabla de órdenes de compra
alter table datos_mercadopublico 
add column if not exists proveedor_rut text,
add column if not exists proveedor_nombre text;

-- Actualizar política (no es necesario cambiarla si ya permite todo al admin, pero bueno confirmar)
