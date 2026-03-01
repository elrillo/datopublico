import { createLegislativoClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, FileText, Activity } from 'lucide-react'
import Link from 'next/link'
import { VotingChart } from '@/components/legislativo/VotingChart'

// Forzar revalidacion temporal para ver datos frescos
export const revalidate = 60

interface Props {
    params: Promise<{ boletin: string }>
}

interface ProyectoLey {
    boletin: string
    titulo: string
    fecha_ingreso: string
    estado?: string
    etapa?: string
    camara_origen?: string
    iniciativa?: string
    urgencia_actual?: string
    link_tramitacion?: string
}

interface Votacion {
    id: number
    fecha: string
    materia: string
    resultado: string
    quorum?: string
}

interface VotoDetalle {
    opcion_voto: string
}

export default async function ProyectoDetallePage({ params }: Props) {
    const supabase = await createLegislativoClient()
    const { boletin } = await params

    // 1. Obtener proyecto
    const { data: proyectoRaw } = await supabase
        .from('proyectos_ley')
        .select('*')
        .eq('boletin', boletin)
        .single()

    const proyecto = proyectoRaw as unknown as ProyectoLey

    if (!proyecto) {
        return notFound()
    }

    // 2. Obtener votaciones asociadas
    const { data: votacionesRaw } = await supabase
        .from('votaciones_sala')
        .select('*')
        .eq('boletin', boletin)
        .order('fecha', { ascending: false })

    const votaciones = (votacionesRaw || []) as unknown as Votacion[]

    // 3. Obtener conteos detallados para cada votación (Agregación manual)
    const votacionesConDetalle = await Promise.all(votaciones.map(async (v) => {
        // Contar votos desde detalle
        const { data: votosRaw } = await supabase
            .from('fact_votaciones_detalle')
            .select('opcion_voto')
            .eq('votacion_id', v.id)

        const votos = (votosRaw || []) as unknown as VotoDetalle[]

        const conteo = {
            si: 0,
            no: 0,
            abstencion: 0,
            pareo: 0
        }

        votos.forEach(voto => {
            const op = voto.opcion_voto?.toLowerCase() || ""
            if (op.includes("favor") || op === "sí" || op === "si" || op === "afirmativa") conteo.si++
            else if (op.includes("contra") || op === "no" || op === "negativa") conteo.no++
            else if (op.includes("abst")) conteo.abstencion++
            else if (op.includes("pareo")) conteo.pareo++
        })

        return {
            ...v,
            conteo
        }
    }))

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <Link href="/datos/legislativo" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors w-fit">
                <ArrowLeft className="w-4 h-4 mr-1" /> Volver al listado
            </Link>

            <div className="bg-card border rounded-xl p-8 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <span className="font-mono text-sm bg-primary/10 text-primary px-3 py-1 rounded w-fit font-medium">
                        Boletín {proyecto.boletin}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Ingreso: {new Date(proyecto.fecha_ingreso).toLocaleDateString()}
                    </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">{proyecto.titulo}</h1>

                <div className="flex flex-wrap gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm border font-medium ${proyecto.estado === 'Publicado' ? 'bg-green-100 text-green-800 border-green-200' :
                            proyecto.estado === 'En tramitación' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                        {proyecto.estado || proyecto.etapa || 'Sin estado'}
                    </span>
                    {proyecto.urgencia_actual && (
                        <span className="px-3 py-1 rounded-full text-sm border bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Urgencia: {proyecto.urgencia_actual}
                        </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-sm border bg-zinc-50 text-zinc-700 border-zinc-200">
                        Origen: {proyecto.camara_origen}
                    </span>
                </div>

                {proyecto.link_tramitacion && (
                    <div className="mt-6 pt-6 border-t">
                        <a
                            href={proyecto.link_tramitacion}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" /> Ver tramitación oficial en origen
                        </a>
                    </div>
                )}
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Historial de Votaciones <span className="text-muted-foreground text-lg font-normal">({votacionesConDetalle.length})</span>
            </h2>

            <div className="space-y-6">
                {votacionesConDetalle.map((v) => (
                    <div key={v.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-muted-foreground">ID: {v.id}</span>
                                    {v.fecha && (
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(v.fecha).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{v.materia || "Votación General"}</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Quórum: {v.quorum || "No especificado"} | Resultado: {v.resultado}
                                </p>
                            </div>

                            <div className="w-full md:w-1/3 border-l pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Distribución de Votos</h4>
                                <VotingChart
                                    si={v.conteo.si}
                                    no={v.conteo.no}
                                    abstencion={v.conteo.abstencion}
                                    pareo={v.conteo.pareo}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {votacionesConDetalle.length === 0 && (
                    <div className="p-12 text-center border border-dashed rounded-lg bg-muted/30">
                        <p className="text-muted-foreground">Este proyecto no tiene votaciones de sala registradas en el periodo actual.</p>
                        <p className="text-xs text-muted-foreground mt-2">(Nota: Puede estar en trabajo de comisiones)</p>
                    </div>
                )}
            </div>
        </div>
    )
}
