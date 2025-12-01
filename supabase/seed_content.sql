-- Create estudios table if it doesn't exist
CREATE TABLE IF NOT EXISTS estudios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    category TEXT,
    pdf_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 4 News items
INSERT INTO noticias (title, slug, content, image_url, is_published, published_at)
VALUES 
(
    'Ministerio de Salud anuncia inversión histórica en infraestructura hospitalaria', 
    'minsal-inversion-historica-2025', 
    'El Ministerio de Salud ha confirmado un plan de inversión de más de 500 mil millones de pesos para la renovación de hospitales en regiones. Este plan contempla la construcción de 5 nuevos recintos y la modernización de otros 12. "Es un esfuerzo sin precedentes para descentralizar la salud", señaló la ministra.',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    true,
    NOW() - INTERVAL '2 days'
),
(
    'Contraloría detecta irregularidades en licitaciones municipales',
    'contraloria-irregularidades-municipios',
    'Un informe reciente de la Contraloría General de la República ha puesto en alerta a 15 municipios del país por irregularidades en procesos de licitación de aseo y ornato. El documento señala falta de competencia y posibles conflictos de interés.',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop',
    true,
    NOW() - INTERVAL '5 days'
),
(
    'Educación Pública: Aumenta matrícula en colegios estatales',
    'aumento-matricula-educacion-publica',
    'Por tercer año consecutivo, la matrícula en establecimientos de educación pública ha mostrado un alza. Según expertos, esto se debe a la implementación de los nuevos Servicios Locales de Educación (SLEP) y a la gratuidad universitaria.',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop',
    true,
    NOW() - INTERVAL '10 days'
),
(
    'Nuevo portal de Transparencia Activa facilita acceso a datos',
    'nuevo-portal-transparencia-activa',
    'El Consejo para la Transparencia lanzó hoy su renovado portal web, que promete facilitar el acceso a la información pública para ciudadanos y periodistas. La nueva interfaz incluye visualizaciones de datos y un buscador mejorado.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    true,
    NOW() - INTERVAL '15 days'
);

-- Insert 4 Research items (Estudios)
INSERT INTO estudios (title, slug, description, content, image_url, category, is_published, published_at)
VALUES
(
    'Radiografía del Gasto en Salud 2024',
    'radiografia-gasto-salud-2024',
    'Un análisis exhaustivo sobre la eficiencia del gasto público en la red hospitalaria nacional, identificando brechas y oportunidades de mejora en la gestión de recursos.',
    'Este estudio analiza en detalle cómo se distribuyen los recursos en el sistema de salud público. Se examinaron más de 10.000 órdenes de compra y se cruzaron con datos de atención hospitalaria. Los resultados revelan que...',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop',
    'Salud',
    true,
    NOW() - INTERVAL '1 month'
),
(
    'Transparencia Municipal: El desafío de la digitalización',
    'transparencia-municipal-digitalizacion',
    'Evaluación del estado de digitalización de los procesos de compra en 345 municipios y su impacto en la prevención de la corrupción y la eficiencia administrativa.',
    'La transformación digital en los municipios es clave para la transparencia. Este reporte evalúa el nivel de madurez digital de las municipalidades chilenas, destacando casos de éxito y áreas críticas...',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    'Transparencia',
    true,
    NOW() - INTERVAL '2 months'
),
(
    'Educación Pública y Subvenciones: ¿Dónde va el dinero?',
    'educacion-publica-subvenciones',
    'Estudio detallado sobre el flujo de recursos desde el nivel central a los establecimientos educacionales y su correlación con resultados SIMCE y PSU.',
    'Analizamos la trazabilidad de las subvenciones escolares preferenciales (SEP) y su impacto real en la calidad educativa. Los datos sugieren que una mayor inversión no siempre correlaciona con mejores resultados si no hay gestión...',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
    'Educación',
    true,
    NOW() - INTERVAL '3 months'
),
(
    'Compras Públicas Sustentables: Un análisis de mercado',
    'compras-publicas-sustentables',
    'Informe sobre la incorporación de criterios de sustentabilidad en las licitaciones del Estado y el crecimiento de proveedores verdes.',
    'El Estado tiene un poder de compra enorme. Este estudio mide cuánto de ese poder se está utilizando para fomentar una economía más verde y sustentable, analizando las licitaciones de los últimos 5 años...',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop',
    'Medio Ambiente',
    true,
    NOW() - INTERVAL '4 months'
);
