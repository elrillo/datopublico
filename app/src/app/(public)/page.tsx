import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowRight, BarChart3, Building2, GraduationCap, HeartPulse, Search } from "lucide-react"
import { FeaturedData } from "@/components/home/FeaturedData"
import { NewsCarousel } from "@/components/home/NewsCarousel"
import { ResearchHighlights } from "@/components/home/ResearchHighlights"

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-background">
                <div className="container px-4 mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                                🚀 Nueva Plataforma 2025
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                                Datos que <br />
                                <span className="text-primary">Transforman</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Fiscalizamos el uso de recursos públicos a través de tecnología y análisis de datos. Porque la transparencia es el primer paso hacia la confianza.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow" asChild>
                                    <Link href="/compras">
                                        Explorar Datos <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                                    <Link href="/estudios">Ver Investigaciones</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse" />
                            <div className="relative bg-card border rounded-2xl shadow-2xl p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <HeartPulse className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Gasto en Salud</div>
                                        <div className="text-sm text-muted-foreground">Últimos 30 días</div>
                                    </div>
                                    <div className="ml-auto font-bold text-green-600">+12%</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
                                        <div className="h-full bg-primary w-[70%]" />
                                    </div>
                                    <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
                                        <div className="h-full bg-primary/60 w-[45%]" />
                                    </div>
                                    <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
                                        <div className="h-full bg-primary/30 w-[30%]" />
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Total procesado</span>
                                    <span className="font-bold text-xl">$45.2M</span>
                                </div>
                            </div>

                            <div className="absolute -bottom-12 -left-12 bg-card border rounded-2xl shadow-xl p-4 w-64 -rotate-3 hover:rotate-0 transition-transform duration-500 delay-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Search className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold">Fiscalización</div>
                                        <div className="text-xs text-muted-foreground">345 municipios</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Data Section */}
            <FeaturedData />

            {/* Research Highlights Section (New) */}
            <ResearchHighlights />

            {/* News Carousel Section */}
            <NewsCarousel />

            {/* Features Grid */}
            <section className="py-20 bg-muted/50">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Link href="/compras" className="group">
                            <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Compras Públicas</h3>
                                <p className="text-muted-foreground">
                                    Monitorea licitaciones y órdenes de compra de MercadoPúblico en tiempo real.
                                </p>
                            </div>
                        </Link>

                        <Link href="/salud" className="group">
                            <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <HeartPulse className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Salud Pública</h3>
                                <p className="text-muted-foreground">
                                    Visualiza el gasto en hospitales, medicamentos e infraestructura sanitaria.
                                </p>
                            </div>
                        </Link>

                        <Link href="/educacion" className="group">
                            <div className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Educación</h3>
                                <p className="text-muted-foreground">
                                    Analiza la inversión en establecimientos educacionales y subvenciones escolares.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
