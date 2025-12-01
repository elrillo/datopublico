import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { FileText, Plus, Users, Newspaper, Eye } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/Badge"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats in parallel
    const [
        { count: newsCount },
        { count: publishedNewsCount },
        { count: usersCount },
        { data: recentNews }
    ] = await Promise.all([
        supabase.from('noticias').select('*', { count: 'exact', head: true }),
        supabase.from('noticias').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('noticias').select('*').order('created_at', { ascending: false }).limit(5)
    ])

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center space-x-2">
                        <Button asChild>
                            <Link href="/admin/noticias/nuevo">
                                <Plus className="mr-2 h-4 w-4" /> Nueva Noticia
                            </Link>
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
                            <div className="text-2xl font-bold">{newsCount || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Artículos en la base de datos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Publicadas
                            </CardTitle>
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{publishedNewsCount || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Visibles para el público
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Usuarios Registrados
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{usersCount || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Miembros de la comunidad
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Visitas Totales
                            </CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">--</div>
                            <p className="text-xs text-muted-foreground">
                                (Próximamente Analytics)
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Noticias Recientes</CardTitle>
                            <CardDescription>
                                Últimos artículos creados o modificados.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentNews?.map((item) => (
                                    <div key={item.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString()} - {item.category || 'General'}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <Badge variant={item.is_published ? "default" : "secondary"}>
                                                {item.is_published ? "Publicado" : "Borrador"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {(!recentNews || recentNews.length === 0) && (
                                    <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Accesos Rápidos</CardTitle>
                            <CardDescription>
                                Gestión común del sitio.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/admin/usuarios">
                                    <Users className="mr-2 h-4 w-4" /> Gestionar Usuarios
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/admin/noticias">
                                    <FileText className="mr-2 h-4 w-4" /> Ver Todas las Noticias
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/">
                                    <Eye className="mr-2 h-4 w-4" /> Ver Sitio Público
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
