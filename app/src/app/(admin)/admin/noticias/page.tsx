'use client'

import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Edit, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type NewsItem = {
    id: string
    title: string
    slug: string
    published_at: string | null
    is_published: boolean
    created_at: string
}

export default function NewsListPage() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('noticias')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching news:', error)
            toast.error('Error al cargar las noticias')
        } else {
            setNews(data as NewsItem[])
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta noticia?')) return

        const { error } = await supabase
            .from('noticias')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting news:', error)
            toast.error('Error al eliminar la noticia')
        } else {
            toast.success('Noticia eliminada correctamente')
            setNews(news.filter(n => n.id !== id))
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Noticias</h2>
                    <p className="text-muted-foreground">
                        Gestiona los artículos y publicaciones del sitio.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/noticias/nuevo">
                        <Plus className="mr-2 h-4 w-4" /> Nueva Noticia
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Artículos Publicados</CardTitle>
                    <CardDescription>
                        Lista de noticias, reportajes y artículos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha Publicación</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No hay noticias registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                news.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.title}
                                            <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                /{item.slug}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.is_published ? "default" : "secondary"}>
                                                {item.is_published ? "Publicado" : "Borrador"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.published_at ? new Date(item.published_at).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/noticias/${item.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
