import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Calendar, FileText, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function EstudiosPage() {
    const supabase = await createClient()
    const { data: studies } = await supabase
        .from('estudios')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    const featuredStudy = studies && studies.length > 0 ? studies[0] : null
    const otherStudies = studies && studies.length > 1 ? studies.slice(1) : []

    return (
        <div className="container mx-auto px-4 py-12 space-y-16">
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight">Estudios e Investigaciones</h1>
                <p className="text-muted-foreground text-lg">
                    Análisis en profundidad sobre el uso de recursos públicos, basados en datos y evidencia.
                </p>
            </div>

            {featuredStudy && (
                <section className="relative rounded-3xl overflow-hidden shadow-2xl group border border-border/50">
                    <div className="grid md:grid-cols-2 min-h-[500px]">
                        <div className="relative h-full min-h-[300px] md:min-h-full overflow-hidden">
                            <img
                                src={featuredStudy.image_url || "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop"}
                                alt={featuredStudy.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                        </div>
                        <div className="bg-card p-8 md:p-12 flex flex-col justify-center relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                        {featuredStudy.category || 'Investigación'}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {featuredStudy.published_at ? new Date(featuredStudy.published_at).toLocaleDateString() : ""}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight group-hover:text-primary transition-colors">
                                    <Link href={`/estudios/${featuredStudy.id}`}>
                                        {featuredStudy.title}
                                    </Link>
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed line-clamp-4">
                                    {featuredStudy.description || featuredStudy.content?.substring(0, 200) + "..."}
                                </p>
                                <div className="pt-4 flex gap-4">
                                    <Button asChild className="h-11 px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                        <Link href={`/estudios/${featuredStudy.id}`}>
                                            Leer Estudio <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                    {featuredStudy.pdf_url && (
                                        <Button variant="outline" className="h-11 px-6">
                                            <Download className="w-4 h-4 mr-2" /> PDF
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {otherStudies.map((study) => (
                    <Card key={study.id} className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 group border-border/50 hover:-translate-y-1">
                        <div className="aspect-video w-full bg-muted relative overflow-hidden">
                            <img
                                src={study.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"}
                                alt={study.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-none">
                                    {study.category || 'Estudio'}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {study.published_at ? new Date(study.published_at).toLocaleDateString() : ""}
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    Lectura
                                </div>
                            </div>
                            <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                <Link href={`/estudios/${study.id}`}>
                                    {study.title}
                                </Link>
                            </h3>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                {study.description || study.content?.substring(0, 150) + "..."}
                            </p>
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto">
                            <Button variant="ghost" className="w-full justify-between group/btn hover:bg-primary/5 hover:text-primary" asChild>
                                <Link href={`/estudios/${study.id}`}>
                                    Leer más <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {(!studies || studies.length === 0) && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                    No hay estudios publicados por el momento.
                </div>
            )}
        </div>
    )
}
