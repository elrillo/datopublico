import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: article } = await supabase
        .from('noticias')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (!article) {
        notFound()
    }

    return (
        <article className="container mx-auto px-4 py-12 max-w-4xl">
            <Button variant="ghost" asChild className="mb-8 pl-0 hover:pl-2 transition-all">
                <Link href="/noticias">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Noticias
                </Link>
            </Button>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-sm font-semibold bg-primary/10 text-primary rounded-full">
                            General
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-b pb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Sin fecha'}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Equipo de Datos
                        </div>
                    </div>
                </div>

                {article.image_url && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted shadow-lg">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg dark:prose-invert max-w-none pt-8"
                    style={{ whiteSpace: 'pre-wrap' }} // Basic handling for text content if not HTML
                >
                    {article.content}
                </div>

                <div className="pt-12 mt-12 border-t flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Etiquetas:</span>
                    <div className="flex gap-2">
                        <span className="bg-secondary px-2 py-1 rounded text-xs">Transparencia</span>
                        <span className="bg-secondary px-2 py-1 rounded text-xs">Datos</span>
                    </div>
                </div>
            </div>
        </article>
    )
}

