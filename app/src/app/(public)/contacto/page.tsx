"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Mail, MessageSquare, Send, ShieldAlert } from "lucide-react"

export default function ContactoPage() {
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            alert("Mensaje enviado (simulación)")
        }, 1000)
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-10">
                    <div>
                        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
                            Hablemos
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Contáctanos</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            ¿Tienes alguna denuncia, sugerencia o quieres colaborar con nosotros? Tu feedback es esencial para mejorar la transparencia pública.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex gap-6 items-start group">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Mail className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-1">Correo Electrónico</h3>
                                <p className="text-muted-foreground mb-2">Para consultas generales y prensa.</p>
                                <a href="mailto:contacto@datopublico.cl" className="text-primary font-medium hover:underline">contacto@datopublico.cl</a>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-1">Redes Sociales</h3>
                                <p className="text-muted-foreground mb-2">Síguenos para actualizaciones diarias.</p>
                                <div className="flex gap-4">
                                    <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Twitter</a>
                                    <a href="#" className="text-sm font-medium hover:text-primary transition-colors">LinkedIn</a>
                                    <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Instagram</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                <ShieldAlert className="w-5 h-5" />
                                <CardTitle className="text-base">Canal de Denuncias</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Si deseas realizar una denuncia anónima sobre irregularidades en compras públicas, por favor utiliza nuestro <a href="#" className="underline font-medium hover:text-foreground">formulario encriptado</a> o contáctanos vía Signal.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/50 shadow-xl">
                    <CardHeader className="space-y-1 p-8 pb-4">
                        <CardTitle className="text-2xl">Envíanos un mensaje</CardTitle>
                        <CardDescription className="text-base">
                            Completa el formulario y nos pondremos en contacto contigo a la brevedad.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input id="name" placeholder="Tu nombre" required className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="tu@email.com" required className="h-11" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Asunto</Label>
                                <Input id="subject" placeholder="¿Sobre qué quieres hablar?" required className="h-11" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Mensaje</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Escribe tu mensaje aquí..."
                                    className="min-h-[150px] resize-none"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-11 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" disabled={isLoading}>
                                {isLoading ? (
                                    "Enviando..."
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Enviar Mensaje
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
