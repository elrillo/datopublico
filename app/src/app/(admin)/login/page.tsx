import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { BarChart3 } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                            <BarChart3 className="w-7 h-7" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
                    <CardDescription>
                        Ingresa tus credenciales para acceder al panel de administración.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" type="email" placeholder="admin@datopublico.cl" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Contraseña</Label>
                            <Link href="#" className="text-sm text-primary hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <Input id="password" type="password" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full">Iniciar Sesión</Button>
                    <div className="text-center text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">
                            ← Volver al sitio público
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
