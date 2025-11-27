-- Poblar tabla de proveedores con datos existentes en órdenes de compra
insert into proveedores (rut, nombre)
select distinct proveedor_rut, proveedor_nombre
from datos_mercadopublico
where proveedor_rut is not null
on conflict (rut) do nothing;
