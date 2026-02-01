DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles 
      WHERE rolname = 'postgres') THEN
      CREATE ROLE postgres LOGIN SUPERUSER PASSWORD 'postgres_password@123';
   END IF;
END
$do$;

-- Crear el rol 'leoneldev_tech' si no existe (usuario dedicado para la aplicación)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles 
      WHERE rolname = 'leoneldev_tech') THEN
      CREATE ROLE leoneldev_tech LOGIN PASSWORD 'leoneldev_tech@123';
   END IF;
END
$do$;

-- Crear la base de datos si no existe
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'db_focoanuncio_tech') THEN
      CREATE DATABASE db_focoanuncio_tech;
   END IF;
END
$do$;

-- Dar privilegios al usuario 'leoneldev_tech' sobre la base de datos
GRANT ALL PRIVILEGES ON DATABASE db_focoanuncio_tech TO leoneldev_tech;

-- ⚠️ Estos permisos se aplican al esquema 'public' dentro de la base de datos
GRANT ALL PRIVILEGES ON SCHEMA public TO leoneldev_tech;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO leoneldev_tech;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO leoneldev_tech;

-- Puedes desactivar el acceso del usuario 'postgres' para producción si no lo necesitas:
-- ALTER ROLE postgres NOLOGIN;

-- Conectarse a la base de datos y activar la extensión PostGIS
\connect db_focoanuncio_tech;

-- Activar PostGIS (soporte para datos geoespaciales)
CREATE EXTENSION IF NOT EXISTS postgis;

