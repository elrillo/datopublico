import { NewsCard } from "@/components/news/NewsCard"

// Mock data for news
const news = [
    {
        id: 1,
        title: "Licitación Hospitalaria bajo la lupa: Análisis de sobreprecios",
        excerpt: "Un estudio detallado de las últimas compras en el sector salud revela inconsistencias en los precios de insumos médicos básicos en tres regiones del país.",
        date: "26 de Noviembre, 2023",
        slug: "licitacion-hospitalaria-bajo-lupa",
        category: "Salud",
        imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "MOP anuncia nueva plataforma de transparencia para obras viales",
        excerpt: "El Ministerio de Obras Públicas busca digitalizar el 100% de los contratos de mantenimiento de carreteras para permitir un seguimiento ciudadano en tiempo real.",
        date: "24 de Noviembre, 2023",
        slug: "mop-nueva-plataforma-transparencia",
        category: "Obras Públicas",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Gasto en Educación: ¿Dónde van los recursos de la subvención escolar?",
        excerpt: "Visualizamos el flujo de recursos desde el nivel central hasta los establecimientos educacionales, destacando las áreas con mayor inversión este año.",
        date: "20 de Noviembre, 2023",
        slug: "gasto-educacion-subvencion-escolar",
        category: "Educación",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Compras Ágiles: El mecanismo más usado por municipios en 2023",
        excerpt: "El uso de la modalidad de Compra Ágil aumentó un 45% en las municipalidades, agilizando procesos pero planteando desafíos en la fiscalización.",
        date: "15 de Noviembre, 2023",
        slug: "compras-agiles-municipios-2023",
        category: "Compras",
        imageUrl: "https://images.unsplash.com/photo-1554224155-98406858d0be?q=80&w=2072&auto=format&fit=crop"
    }
]

export default function NoticiasPage() {
    return (
        <div className="container mx-auto px-4 py-12 space-y-12">
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight">Noticias y Reportajes</h1>
                <p className="text-muted-foreground text-lg">
                    Investigaciones, análisis de datos y novedades sobre la gestión de recursos públicos en Chile.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                    <NewsCard
                        key={item.id}
                        title={item.title}
                        excerpt={item.excerpt}
                        date={item.date}
                        slug={item.slug}
                        category={item.category}
                        imageUrl={item.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
}
