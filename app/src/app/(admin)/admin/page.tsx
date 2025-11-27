import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { BarChart3, FileText, Plus, Settings, Users } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center px-4">
                    <div className="mr-4 hidden md:flex">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <BarChart3 className="h-6 w-6" />
                            <span className="hidden font-bold sm:inline-block">DatoPúblico Admin</span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            <Link href="/admin" className="transition-colors hover:text-foreground/80 text-foreground">
                                Dashboard
                            </Link>
                            <Link href="/admin/noticias" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Noticias
                            </Link>
                            <Link href="/admin/usuarios" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Usuarios
                            </Link>
                        </nav>
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center space-x-2">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nueva Noticia
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Noticias
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                +2 desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Usuarios Activos
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+573</div>
                            <p className="text-xs text-muted-foreground">
                                +201 desde la semana pasada
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Configuración
                            </CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Sistema</div>
                            <p className="text-xs text-muted-foreground">
                                v1.0.0-beta
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Noticias Recientes</CardTitle>
                            <CardDescription>
                                Últimos artículos publicados en la plataforma.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <div className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Licitación Hospitalaria</p>
                                        <p className="text-sm text-muted-foreground">
                                            Publicado hace 2 horas
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">Publicado</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Irregularidades en Obras</p>
                                        <p className="text-sm text-muted-foreground">
                                            Borrador
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-muted-foreground">Borrador</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
