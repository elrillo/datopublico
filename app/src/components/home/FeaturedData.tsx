import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowUpRight, TrendingUp, Users, Building2, DollarSign } from "lucide-react"
import Link from "next/link"

export function FeaturedData() {
    // Mock data - eventually this will come from the API
    const stats = [
        {
            title: "Gasto Público Hoy",
            value: "$12.450 M",
            change: "+2.5%",
            trend: "up",
            icon: DollarSign,
            description: "Transacciones procesadas en las últimas 24h",
            link: "/compras"
        },
        {
            title: "Licitaciones Activas",
            value: "1.240",
            change: "+12",
            trend: "up",
            icon: Building2,
            description: "Oportunidades de negocio abiertas",
            link: "/compras"
        },
        {
            title: "Organismos Activos",
            value: "345",
            change: "0",
            trend: "neutral",
            icon: Users,
            description: "Entidades públicas realizando compras",
            link: "/compras"
        }
    ]

    return (
        <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dato Destacado</h2>
                        <p className="text-muted-foreground mt-2">Resumen de la actividad fiscal en tiempo real.</p>
                    </div>
                    <Link href="/compras" className="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
                        Ver todos los datos <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <stat.icon className="h-4 w-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                                <div className="flex items-center text-xs text-muted-foreground mt-2">
                                    {stat.trend === 'up' ? (
                                        <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                                    ) : (
                                        <span className="w-3 h-3 mr-1" />
                                    )}
                                    <span className={stat.trend === 'up' ? 'text-emerald-500 font-medium' : ''}>
                                        {stat.change}
                                    </span>
                                    <span className="ml-1">vs ayer</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
