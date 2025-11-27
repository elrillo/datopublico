import Link from "next/link";
import { ArrowRight, BarChart3, Newspaper, Stethoscope, GraduationCap, ShoppingCart } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -z-10 opacity-30 pointer-events-none" />

                <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                        Versión Beta
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                        Transparencia en <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                            Datos Públicos
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Analizamos y visualizamos datos de compras, salud, educación y más, para que la ciudadanía pueda entender cómo se gestionan los recursos del Estado.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/compras"
                            className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
                        >
                            <BarChart3 className="w-5 h-5" />
                            Explorar Datos
                        </Link>
                        <Link
                            href="/noticias"
                            className="h-12 px-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium flex items-center justify-center gap-2 transition-all hover:scale-105"
                        >
                            <Newspaper className="w-5 h-5" />
                            Leer Noticias
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4 py-20 border-t border-border/50">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<ShoppingCart className="w-8 h-8 text-primary" />}
                        title="Compras Públicas"
                        description="Monitorea licitaciones y órdenes de compra de MercadoPúblico en tiempo real."
                        href="/compras"
                    />
                    <FeatureCard
                        icon={<Stethoscope className="w-8 h-8 text-primary" />}
                        title="Salud Pública"
                        description="Visualiza el gasto en hospitales, medicamentos e infraestructura sanitaria."
                        href="/salud"
                    />
                    <FeatureCard
                        icon={<GraduationCap className="w-8 h-8 text-primary" />}
                        title="Educación"
                        description="Analiza la inversión en establecimientos educacionales y subvenciones escolares."
                        href="/educacion"
                    />
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
    return (
        <Link href={href} className="block h-full">
            <div className="p-6 h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors group cursor-pointer">
                <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    {title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground">{description}</p>
            </div>
        </Link>
    );
}
