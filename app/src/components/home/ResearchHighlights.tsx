import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowRight, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

const highlights = [
    {
        id: 1,
        title: "Radiografía del Gasto en Salud 2024",
        category: "Salud",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Transparencia Municipal: El desafío digital",
        category: "Transparencia",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
    }
]

export function ResearchHighlights() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Estudios e Investigaciones</h2>
                        <p className="text-muted-foreground mt-2">Análisis profundo para entender la realidad pública.</p>
                    </div>
                    <Button variant="ghost" className="hidden md:flex" asChild>
                        <Link href="/estudios">
                            Ver todos los estudios <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {highlights.map((item) => (
                        <Link key={item.id} href={`/estudios/${item.id}`} className="group block">
                            <div className="relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[2/1] shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                                    <Badge className="mb-3 bg-primary text-primary-foreground border-none px-3 py-1">
                                        {item.category}
                                    </Badge>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight tracking-tight">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Leer investigación completa <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/estudios">Ver todos los estudios</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
