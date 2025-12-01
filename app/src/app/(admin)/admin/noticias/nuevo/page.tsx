'use client'

import { createClient } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

export default function NewNewsPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category: 'noticia',
        tags: '',
        image_url: '',
        status: 'draft' // draft | published
    })

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        // Auto-generate slug from title
        const slug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")

        setFormData(prev => ({ ...prev, title, slug }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)

            const { data: newNews, error } = await supabase
                .from('noticias')
                .insert([{
                    title: formData.title,
                    slug: formData.slug,
                    content: formData.content,
                    excerpt: formData.excerpt,
                    category: formData.category,
                    tags: tagsArray,
                    image_url: formData.image_url,
                    is_published: formData.status === 'published',
                    published_at: formData.status === 'published' ? new Date().toISOString() : null
                }])
                .select()
                .single()

            if (error) throw error

            // Log audit
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('audit_logs').insert({
                    user_id: user.id,
                    action: 'create',
                    entity: 'news',
                    entity_id: newNews.id,
                    details: { title: formData.title, slug: formData.slug }
                })
            }

            toast.success('Noticia creada exitosamente')
            router.push('/admin/noticias')
            router.refresh()
        } catch (error) {
            console.error('Error creating news:', error)
            toast.error('Error al crear la noticia')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/noticias">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Nueva Noticia</h2>
                    <p className="text-muted-foreground">
                        Crea un nuevo artículo para el sitio.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Artículo</CardTitle>
                    <CardDescription>
                        Completa la información de la noticia.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    placeholder="Título de la noticia"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    placeholder="titulo-de-la-noticia"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">Tipo de Contenido</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="noticia">Noticia</SelectItem>
                                        <SelectItem value="investigacion">Investigación</SelectItem>
                                        <SelectItem value="reportaje">Reportaje</SelectItem>
                                        <SelectItem value="columna">Columna de Opinión</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
                                <Input
                                    id="tags"
                                    placeholder="salud, transparencia, compras"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Bajada / Resumen</Label>
                            <Textarea
                                id="excerpt"
                                placeholder="Breve descripción que aparecerá en las tarjetas..."
                                className="h-20"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">URL de Imagen Principal</Label>
                            <Input
                                id="image"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Contenido</Label>
                            <Textarea
                                id="content"
                                placeholder="Escribe el contenido aquí..."
                                className="min-h-[300px]"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Borrador</SelectItem>
                                    <SelectItem value="published">Publicado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" asChild>
                                <Link href="/admin/noticias">Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Noticia
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
