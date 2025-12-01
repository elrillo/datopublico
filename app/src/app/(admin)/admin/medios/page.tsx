'use client'

import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { toast } from "sonner"
import { Copy, Loader2, Trash2, Upload, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

type FileObject = {
    name: string
    id: string
    updated_at: string
    created_at: string
    last_accessed_at: string
    metadata: Record<string, any>
}

export default function MediaLibraryPage() {
    const [files, setFiles] = useState<FileObject[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const supabase = createClient()
    const BUCKET_NAME = 'images'

    useEffect(() => {
        fetchFiles()
    }, [])

    const fetchFiles = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .list(undefined, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            })

        if (error) {
            console.error('Error fetching files:', error)
            toast.error('Error al cargar imágenes')
        } else {
            setFiles(data || [])
        }
        setLoading(false)
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        try {
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file)

            if (error) throw error

            toast.success('Imagen subida exitosamente')
            fetchFiles()

            // Log audit
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('audit_logs').insert({
                    user_id: user.id,
                    action: 'create',
                    entity: 'media',
                    entity_id: filePath,
                    details: { filename: file.name }
                })
            }

        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Error al subir imagen')
        } finally {
            setUploading(false)
            // Reset input
            e.target.value = ''
        }
    }

    const copyUrl = (fileName: string) => {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)
        navigator.clipboard.writeText(data.publicUrl)
        toast.success('URL copiada al portapapeles')
    }

    const handleDelete = async (fileName: string) => {
        if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

        try {
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([fileName])

            if (error) throw error

            toast.success('Imagen eliminada')
            setFiles(files.filter(f => f.name !== fileName))

            // Log audit
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('audit_logs').insert({
                    user_id: user.id,
                    action: 'delete',
                    entity: 'media',
                    entity_id: fileName,
                    details: {}
                })
            }
        } catch (error) {
            console.error('Error deleting image:', error)
            toast.error('Error al eliminar imagen')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Biblioteca de Medios</h2>
                    <p className="text-muted-foreground">
                        Gestiona las imágenes y archivos de tu sitio.
                    </p>
                </div>
                <div>
                    <Button disabled={uploading} asChild>
                        <label className="cursor-pointer">
                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Subir Imagen
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </label>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Archivos ({files.length})</CardTitle>
                    <CardDescription>
                        Imágenes disponibles en el bucket '{BUCKET_NAME}'.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : files.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
                            <p>No hay imágenes. Sube una para empezar.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {files.map((file) => {
                                const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name)
                                return (
                                    <div key={file.id} className="group relative aspect-square bg-muted rounded-lg overflow-hidden border">
                                        <Image
                                            src={publicUrl}
                                            alt={file.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => copyUrl(file.name)}
                                                title="Copiar URL"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleDelete(file.name)}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate px-2">
                                            {file.name}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
