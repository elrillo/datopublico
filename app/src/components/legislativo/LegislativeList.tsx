"use client"

import { useState } from "react"
import { Search, Filter, BookOpen } from "lucide-react"
import Link from "next/link"

interface ProyectoLey {
    boletin: string
    titulo: string
    fecha_ingreso: string
    estado?: string
    etapa?: string
    camara_origen?: string
    iniciativa?: string
}

interface LegislativeListProps {
    initialProjects: ProyectoLey[]
}

export function LegislativeList({ initialProjects }: LegislativeListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterEstado, setFilterEstado] = useState("todos")

    // Lista deduplicada de estados para el filtro
    const estadosUnicos = Array.from(new Set(initialProjects.map(p => p.estado || p.etapa || "Desconocido"))).sort()

    const filteredProjects = initialProjects.filter(proyecto => {
        const matchesSearch =
            proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proyecto.boletin.includes(searchTerm)

        const matchesEstado = filterEstado === "todos" ||
            (proyecto.estado === filterEstado) ||
            (proyecto.etapa === filterEstado)

        return matchesSearch && matchesEstado
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por título o boletín..."
                        className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                        >
                            <option value="todos">Todos los estados</option>
                            {estadosUnicos.map(e => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredProjects.map((proyecto) => (
                    <Link key={proyecto.boletin} href={`/datos/legislativo/${proyecto.boletin}`}>
                        <div className="bg-card p-5 border rounded-lg hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <span className="font-mono text-xs md:text-sm bg-muted px-2 py-1 rounded w-fit text-muted-foreground group-hover:text-foreground transition-colors">
                                    {proyecto.boletin}
                                </span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                    {new Date(proyecto.fecha_ingreso).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {proyecto.titulo}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-auto">
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${proyecto.estado === 'Publicado' ? 'bg-green-50 text-green-700 border-green-200' :
                                        proyecto.estado === 'En tramitación' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                    {proyecto.estado || proyecto.etapa || 'Sin estado'}
                                </span>

                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {proyecto.camara_origen?.replace("C.Diputados", "Cámara de Diputados") || "Congreso"}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="p-12 text-center border border-dashed rounded-lg">
                        <p className="text-muted-foreground">No se encontraron proyectos con estos filtros.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
