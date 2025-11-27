"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function NewsForm() {
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            alert("Noticia guardada (simulación)")
        }, 1000)
    }

    return (
        <form onSubmit={onSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Noticia</CardTitle>
                    <CardDescription>
                        Ingresa la información para publicar un nuevo artículo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" placeholder="Ej: Nuevo reporte de gasto público" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" placeholder="ej: nuevo-reporte-gasto-publico" />
                        <p className="text-xs text-muted-foreground">Se generará automáticamente si se deja vacío.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">URL de Imagen</Label>
                        <Input id="image" placeholder="https://..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Contenido</Label>
                        <Textarea
                            id="content"
                            placeholder="Escribe el contenido de la noticia aquí..."
                            className="min-h-[300px]"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="published" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <Label htmlFor="published">Publicar inmediatamente</Label>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                        <Link href="/admin/noticias">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            "Guardando..."
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Noticia
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
