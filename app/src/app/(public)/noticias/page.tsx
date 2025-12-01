import { NewsCard } from "@/components/news/NewsCard"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/Badge"

export default async function NoticiasPage() {
    const supabase = await createClient()
    const { data: news } = await supabase
        .from('noticias')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    const featuredNews = news && news.length > 0 ? news[0] : null
    const otherNews = news && news.length > 1 ? news.slice(1) : []

    return (
        <div className="container mx-auto px-4 py-12 space-y-16">
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight">Noticias y Reportajes</h1>
                <p className="text-muted-foreground text-lg">
                    Investigaciones, análisis de datos y novedades sobre la gestión de recursos públicos en Chile.
                </p>
            </div>

            {featuredNews && (
                <section className="relative rounded-3xl overflow-hidden shadow-2xl group border border-border/50">
                    <div className="grid md:grid-cols-2 min-h-[500px]">
                        <div className="relative h-full min-h-[300px] md:min-h-full overflow-hidden">
                            <img
                                src={featuredNews.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"}
                                alt={featuredNews.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                        </div>
                        <div className="bg-card p-8 md:p-12 flex flex-col justify-center relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                        Destacado
                                    </Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {featuredNews.published_at ? new Date(featuredNews.published_at).toLocaleDateString() : ""}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight group-hover:text-primary transition-colors">
                                    <Link href={`/noticias/${featuredNews.slug}`}>
                                        {featuredNews.title}
                                    </Link>
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed line-clamp-4">
                                    {featuredNews.content ? featuredNews.content.substring(0, 200) + "..." : ""}
                                </p>
                                <div className="pt-4">
                                    <Link
                                        href={`/noticias/${featuredNews.slug}`}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                    >
                                        Leer artículo completo <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {otherNews.map((item) => (
                    <NewsCard
                        key={item.id}
                        title={item.title}
                        excerpt={item.content ? item.content.substring(0, 150) + "..." : ""}
                        date={item.published_at ? new Date(item.published_at).toLocaleDateString() : ""}
                        slug={item.slug}
                        category="General"
                        imageUrl={item.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"}
                    />
                ))}
            </div>

            {(!news || news.length === 0) && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                    No hay noticias publicadas por el momento.
                </div>
            )}
        </div>
    );
}
