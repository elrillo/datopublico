import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
                <ShieldAlert className="h-12 w-12" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Acceso Restringido</h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                No tienes los permisos necesarios para acceder a esta sección.
                Si crees que esto es un error, contacta al administrador.
            </p>
            <div className="flex gap-4">
                <Button asChild variant="default">
                    <Link href="/">Volver al Inicio</Link>
                </Button>
            </div>
        </div>
    )
}
