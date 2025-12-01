import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Lock } from "lucide-react"
import Link from "next/link"

export default async function MemberAreaPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, membership_expires_at')
        .eq('id', user.id)
        .single()

    const isStaff = ['admin', 'editor', 'writer'].includes(profile?.role || '')
    const isMember = profile?.role === 'member'

    // Check expiration
    let isMembershipActive = false
    if (isStaff) {
        isMembershipActive = true
    } else if (isMember) {
        if (!profile.membership_expires_at) {
            isMembershipActive = true // No expiration means lifetime or manual control
        } else {
            isMembershipActive = new Date(profile.membership_expires_at) > new Date()
        }
    }

    if (!isMembershipActive) {
        return (
            <div className="container mx-auto py-20 px-4">
                <Card className="max-w-2xl mx-auto text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-muted">
                                <Lock className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Acceso Restringido</CardTitle>
                        <CardDescription>
                            Esta sección es exclusiva para miembros activos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            {isMember
                                ? "Tu membresía ha expirado. Por favor renueva tu suscripción para continuar accediendo a este contenido."
                                : "Conviértete en miembro para acceder a investigaciones exclusivas, reportes detallados y más."
                            }
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button asChild>
                                <Link href="/">Volver al Inicio</Link>
                            </Button>
                            <Button variant="outline">
                                Renovar / Suscribirse
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Área de Miembros</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Content for members */}
                <Card>
                    <CardHeader>
                        <CardTitle>Investigaciones en Curso</CardTitle>
                        <CardDescription>Avances exclusivos de nuestros próximos reportajes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Contenido disponible solo para miembros activos.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Base de Datos Completa</CardTitle>
                        <CardDescription>Acceso sin restricciones a nuestros datasets.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">Explorar Datos</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Comunidad</CardTitle>
                        <CardDescription>Foro de discusión exclusivo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">Ir al Foro</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
