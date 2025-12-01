"use client"

import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Mail, MessageSquare, Send, ShieldAlert, Loader2 } from "lucide-react"
import { submitContactMessage } from "@/app/actions/contact"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

const initialState: { error?: string; success?: string } = {}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full h-11 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                </>
            ) : (
                <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensaje
                </>
            )}
        </Button>
    )
}

export default function ContactoPage() {
    const [state, formAction] = useFormState(submitContactMessage, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success)
            formRef.current?.reset()
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

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
                                    <a href="https://x.com/datopublicocl" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors">Twitter</a>
                                    <a href="https://www.instagram.com/datopublico/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors">Instagram</a>
                                    <a href="https://www.youtube.com/@DatoPublico" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors">YouTube</a>
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
                        <form ref={formRef} action={formAction} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input id="name" name="name" placeholder="Tu nombre" required className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="tu@email.com" required className="h-11" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Asunto</Label>
                                <Input id="subject" name="subject" placeholder="¿Sobre qué quieres hablar?" required className="h-11" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Mensaje</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Escribe tu mensaje aquí..."
                                    className="min-h-[150px] resize-none"
                                    required
                                />
                            </div>

                            <SubmitButton />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
