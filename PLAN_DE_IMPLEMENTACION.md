# Plan de Implementación - DatoPublico.cl

## 1. Arquitectura de Carpetas

Estructura propuesta para Next.js App Router + Python scripts:

```
/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (public)/        # Rutas públicas (Home, Noticias, Monitor)
│   │   │   ├── page.tsx     # Home
│   │   │   ├── monitor/     # Monitor de Compras
│   │   │   ├── noticias/    # Blog/Noticias
│   │   │   └── contacto/    # Contacto
│   │   ├── (admin)/         # Rutas protegidas
│   │   │   ├── admin/       # Panel de Administración
│   │   │   └── login/       # Login Page
│   │   ├── api/             # API Routes (si son necesarias)
│   │   ├── layout.tsx       # Root Layout
│   │   └── globals.css      # Tailwind imports
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes base (botones, inputs)
│   │   ├── charts/          # Componentes de gráficos (Tremor/Recharts)
│   │   └── layout/          # Navbar, Footer
│   ├── lib/                 # Utilidades y configuración
│   │   ├── supabase.ts      # Cliente Supabase
│   │   └── utils.ts         # Helpers
│   └── types/               # Definiciones TypeScript
├── scripts/                 # Scripts de Ingesta de Datos (Python)
│   ├── requirements.txt     # Dependencias Python
│   ├── etl_mercadopublico.py
│   └── .env                 # Variables de entorno para scripts
├── public/                  # Assets estáticos
├── .env.local               # Variables de entorno Next.js
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 2. Modelo de Base de Datos (Supabase)

### Tabla `noticias`
Almacena los artículos y publicaciones del blog.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key (default: `gen_random_uuid()`) |
| `created_at` | timestamptz | Fecha de creación (default: `now()`) |
| `title` | text | Título de la noticia |
| `slug` | text | URL amigable (único) |
| `content` | text | Contenido (Markdown o HTML) |
| `published_at` | timestamptz | Fecha de publicación visible |
| `image_url` | text | URL de la imagen destacada |
| `is_published` | boolean | Estado de publicación |

### Tabla `datos_mercadopublico`
Almacena datos procesados de licitaciones y órdenes de compra para el monitor.

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `fecha` | date | Fecha del dato |
| `organismo` | text | Nombre del organismo público |
| `monto` | numeric | Monto de la transacción |
| `tipo` | text | Tipo de licitación/compra |
| `descripcion` | text | Descripción breve |
| `sector` | text | Sector (Salud, Obras, etc.) |

## 3. Estrategia de Autenticación

Utilizaremos **Supabase Auth** para la gestión de sesiones.

1.  **Login**: Página `/login` que utiliza `supabase.auth.signInWithPassword`.
2.  **Protección de Rutas**:
    *   **Middleware de Next.js**: Intercepta peticiones a `/admin/*`. Si no hay sesión activa, redirige a `/login`.
3.  **Seguridad de Datos (RLS)**:
    *   Habilitar Row Level Security (RLS) en todas las tablas.
    *   **Lectura (`SELECT`)**: Pública para todos (anon key).
    *   **Escritura (`INSERT`, `UPDATE`, `DELETE`)**: Solo permitida para usuarios autenticados con rol de admin.

## 4. Paso a Paso de Implementación

### Fase 1: Setup Inicial
*   Inicializar proyecto Next.js con TypeScript y Tailwind CSS.
*   Configurar proyecto en Supabase.
*   Instalar librerías de gráficos (Tremor/Recharts) y cliente Supabase (`@supabase/supabase-js`, `@supabase/ssr`).

### Fase 2: Base de Datos & Auth
*   Ejecutar scripts SQL en Supabase para crear tablas.
*   Configurar políticas RLS.
*   Crear usuario administrador manualmente en Supabase Auth.

### Fase 3: Panel de Administración
*   Crear página de Login.
*   Crear Dashboard básico (`/admin`).
*   Implementar formulario para crear/editar noticias.

### Fase 4: Frontend Público
*   Implementar Landing Page con indicadores.
*   Desarrollar "Monitor de Compras" con gráficos conectados a Supabase.
*   Crear listado de noticias y vista de detalle con botones de compartir.

### Fase 5: Scripts Python
*   Configurar entorno Python.
*   Escribir script para conectar a API MercadoPúblico (o fuente de datos).
*   Procesar datos y guardarlos en la tabla `datos_mercadopublico`.
