-- CLEANUP SCRIPT
-- Ejecutar en el proyecto 'DatoPublico' (MercadoPublico) para eliminar restos de tablas legislativas
-- si es que se crearon por error anteriormente.

DROP TABLE IF EXISTS fact_votaciones_detalle CASCADE;
DROP TABLE IF EXISTS fact_diario_sesion CASCADE;
DROP TABLE IF EXISTS votaciones_sala CASCADE;
DROP TABLE IF EXISTS sesiones CASCADE;
DROP TABLE IF EXISTS proyectos_ley CASCADE;
DROP TABLE IF EXISTS senadores CASCADE;
DROP TABLE IF EXISTS diputados CASCADE;
DROP TABLE IF EXISTS legislaturas CASCADE;
DROP TABLE IF EXISTS periodos_legislativos CASCADE;

-- Confirmación
SELECT 'Limpieza legislativa completada' as status;
