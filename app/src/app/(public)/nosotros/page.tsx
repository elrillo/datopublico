import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle2, Database, ShieldCheck, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function NosotrosPage() {
    return (
        <div className="container mx-auto px-4 py-16 space-y-24">
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto space-y-8 relative">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50 -z-10" />

                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground mb-4">
                    Sobre DatoPúblico.cl
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Democratizando el acceso a la <span className="text-primary">información pública</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Transformamos datos complejos en información accesible, permitiendo a la ciudadanía fiscalizar y entender el uso de los recursos del Estado.
                </p>
            </section>

            {/* Mission & Vision Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                <Card className="bg-card border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <Database className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Transparencia Activa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            No basta con que los datos estén disponibles; deben ser comprensibles. Procesamos millones de registros para entregarte visualizaciones claras y útiles.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <CardTitle className="text-xl">Fiscalización Ciudadana</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            Empoderamos a periodistas, ONGs y ciudadanos comunes con herramientas para detectar irregularidades y asegurar el buen uso de los fondos públicos.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl">Independencia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            Somos una iniciativa independiente, sin afiliación política ni financiamiento estatal, lo que garantiza la objetividad de nuestros análisis.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Methodology Section */}
            <section className="max-w-5xl mx-auto bg-muted/30 rounded-3xl p-8 md:p-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nuestra Metodología</h2>
                        <p className="text-lg text-muted-foreground">
                            Utilizamos tecnología de punta para asegurar la integridad y precisión de los datos que presentamos.
                        </p>
                        <div className="pt-4">
                            <Button variant="outline" asChild>
                                <Link href="/metodologia">
                                    Ver documentación técnica <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start p-4 bg-background rounded-xl shadow-sm border border-border/50">
                            <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Recolección de Datos</h3>
                                <p className="text-sm text-muted-foreground">
                                    Conexión directa con APIs de MercadoPúblico, MINSAL y MINEDUC.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 bg-background rounded-xl shadow-sm border border-border/50">
                            <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Procesamiento y Limpieza</h3>
                                <p className="text-sm text-muted-foreground">
                                    Estandarización y enriquecimiento de datos con algoritmos propios.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 bg-background rounded-xl shadow-sm border border-border/50">
                            <div className="mt-1 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Visualización</h3>
                                <p className="text-sm text-muted-foreground">
                                    Dashboards interactivos actualizados en tiempo real.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
