"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react"

// Mock data for news
const newsItems = [
    {
        id: 1,
        title: "Aumento del 15% en licitaciones de salud",
        excerpt: "El último trimestre muestra un incremento significativo en la inversión pública sanitaria.",
        image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1000&auto=format&fit=crop",
        date: "30 Nov 2025",
        category: "Salud"
    },
    {
        id: 2,
        title: "Nuevas regulaciones para compras directas",
        excerpt: "Contraloría emite dictamen que restringe el uso de trato directo en municipios.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
        date: "28 Nov 2025",
        category: "Normativa"
    },
    {
        id: 3,
        title: "Reporte de transparencia municipal 2025",
        excerpt: "Ranking de las municipalidades con mejor y peor índice de respuesta a solicitudes.",
        image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1000&auto=format&fit=crop",
        date: "25 Nov 2025",
        category: "Fiscalización"
    },
    {
        id: 4,
        title: "Educación pública: Análisis de subvenciones",
        excerpt: "Desglose de cómo se distribuyen los recursos en los colegios municipales.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop",
        date: "20 Nov 2025",
        category: "Educación"
    }
]

export function NewsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(1)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(3)
            } else if (window.innerWidth >= 768) {
                setItemsPerPage(2)
            } else {
                setItemsPerPage(1)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsPerPage >= newsItems.length ? 0 : prevIndex + 1
        )
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? Math.max(0, newsItems.length - itemsPerPage) : prevIndex - 1
        )
    }

    return (
        <section className="py-20 container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Últimas Noticias</h2>
                    <p className="text-muted-foreground mt-2">Actualidad y análisis sobre el gasto público.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevSlide}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextSlide}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out gap-6"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                >
                    {newsItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                        >
                            <Link href={`/noticias/${item.id}`} className="group h-full block">
                                <Card className="h-full overflow-hidden border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-4 left-4 bg-background/90 text-foreground text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                                            {item.category}
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wider">
                                            <Newspaper className="w-3 h-3" />
                                            {item.date}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                            {item.excerpt}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 text-center">
                <Button variant="outline" asChild>
                    <Link href="/noticias">Ver todas las noticias</Link>
                </Button>
            </div>
        </section>
    )
}
