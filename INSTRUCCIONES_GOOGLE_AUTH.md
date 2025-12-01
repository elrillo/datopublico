# Guía de Configuración de Autenticación con Google

Para que el inicio de sesión funcione, necesitas conectar tu proyecto de Supabase con Google Cloud Platform.

## 1. Configuración en Google Cloud Console

1.  Ve a [Google Cloud Console](https://console.cloud.google.com/).
2.  Crea un **Nuevo Proyecto** (o selecciona uno existente).
3.  En el menú lateral, ve a **APIs y servicios** > **Pantalla de consentimiento de OAuth**.
    *   Selecciona **Externo** y dale a Crear.
    *   Llena los datos obligatorios (Nombre de la app, correos de soporte).
    *   En "Dominios autorizados", no es necesario poner nada por ahora si estás en desarrollo, pero idealmente añade `supabase.co`.
    *   Guarda y continúa hasta terminar.
4.  Ve a **Credenciales** (en el menú lateral de APIs y servicios).
    *   Haz clic en **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**.
    *   Tipo de aplicación: **Aplicación web**.
    *   Nombre: "Supabase Auth" (o lo que prefieras).
    *   **Orígenes autorizados de JavaScript**:
        *   Añade: `https://<tu-project-id>.supabase.co` (Reemplaza `<tu-project-id>` con el ID de tu proyecto Supabase).
        *   *Nota: Puedes encontrar esta URL en tu Dashboard de Supabase > Settings > API > URL*.
    *   **URI de redireccionamiento autorizados**:
        *   Añade: `https://<tu-project-id>.supabase.co/auth/v1/callback`
    *   Haz clic en **Crear**.
5.  Copia el **ID de cliente** y el **Secreto de cliente**.

## 2. Configuración en Supabase

1.  Ve a tu Dashboard de Supabase.
2.  Entra a **Authentication** > **Providers**.
3.  Busca **Google** y ábrelo.
4.  Activa el interruptor **Enable Google**.
5.  Pega el **Client ID** y **Client Secret** que copiaste de Google.
6.  Haz clic en **Save**.

## 3. Verificación de URL del Sitio

1.  En Supabase, ve a **Authentication** > **URL Configuration**.
2.  Asegúrate de que **Site URL** sea `http://localhost:3000` (para desarrollo local).
3.  En **Redirect URLs**, añade:
    *   `http://localhost:3000/auth/callback`
    *   `https://<tu-dominio-produccion>.vercel.app/auth/callback` (cuando despliegues).

## 4. Ejecutar Migración SQL (IMPORTANTE)

Antes de intentar iniciar sesión, asegúrate de haber ejecutado el script SQL para crear la tabla de perfiles.
Copia el contenido de `supabase/schema_auth_roles.sql` y ejecútalo en el **SQL Editor** de Supabase.
