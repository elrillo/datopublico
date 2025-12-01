import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle2, Coffee, Heart, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function DonarPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl space-y-16">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <Heart className="w-8 h-8 text-red-500 fill-current" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Ayúdanos a mantener la <span className="text-primary">transparencia</span> viva
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    DatoPúblico.cl es un proyecto independiente y autogestionado. Tu aporte nos permite pagar servidores, procesar más datos y seguir fiscalizando sin compromisos.
                </p>
            </section>

            {/* Donation Options */}
            <section className="grid md:grid-cols-3 gap-8">
                <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Coffee className="w-5 h-5 text-amber-600" />
                            Café Virtual
                        </CardTitle>
                        <CardDescription>Un pequeño empujón</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">$3.000 <span className="text-sm font-normal text-muted-foreground">/ único</span></div>
                        <p className="text-sm text-muted-foreground">
                            Invítanos un café para seguir programando hasta tarde.
                        </p>
                        <Button className="w-full" variant="outline">Donar $3.000</Button>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 border-primary shadow-lg scale-105 z-10">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Ciudadano Activo
                        </CardTitle>
                        <CardDescription>Compromiso mensual</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">$5.000 <span className="text-sm font-normal text-muted-foreground">/ mes</span></div>
                        <p className="text-sm text-muted-foreground">
                            Ayúdanos a mantener los servidores activos 24/7.
                        </p>
                        <Button className="w-full">Suscribirse</Button>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Mecenas
                        </CardTitle>
                        <CardDescription>Gran impacto</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">$20.000 <span className="text-sm font-normal text-muted-foreground">/ mes</span></div>
                        <p className="text-sm text-muted-foreground">
                            Financia nuevas investigaciones y reportajes en profundidad.
                        </p>
                        <Button className="w-full" variant="outline">Suscribirse</Button>
                    </CardContent>
                </Card>
            </section>

            {/* Why Donate Section */}
            <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">¿Por qué donar?</h2>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                <p className="text-muted-foreground"><strong>Independencia total:</strong> No aceptamos dinero de partidos políticos ni del gobierno.</p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                <p className="text-muted-foreground"><strong>Sin publicidad:</strong> Mantenemos la plataforma limpia y centrada en los datos.</p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                <p className="text-muted-foreground"><strong>Código Abierto:</strong> Tu aporte ayuda a liberar herramientas para todos.</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center space-y-4">
                        <p className="text-lg font-medium">
                            "La transparencia no es un regalo, es un derecho que debemos ejercer y proteger activamente."
                        </p>
                        <p className="text-sm text-muted-foreground">- El equipo de DatoPúblico</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
