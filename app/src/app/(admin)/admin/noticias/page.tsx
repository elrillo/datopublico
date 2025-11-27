import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Plus, FileText, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export default function NewsListPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Noticias</h2>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/admin/noticias/nuevo">
                            <Plus className="mr-2 h-4 w-4" /> Nueva Noticia
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Artículos Publicados</CardTitle>
                    <CardDescription>
                        Gestiona las noticias y reportajes de la plataforma.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Título</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">Licitación Hospitalaria bajo la lupa</td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                                Publicado
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">26/11/2023</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Menu</span>
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">Irregularidades en Obras Viales</td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                Borrador
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">25/11/2023</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Menu</span>
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
