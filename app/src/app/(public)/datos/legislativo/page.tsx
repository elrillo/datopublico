import { createLegislativoClient } from '@/lib/supabase/server'
import { Landmark, Vote, FileText } from 'lucide-react'
import { LegislativeList } from '@/components/legislativo/LegislativeList'

export const dynamic = 'force-dynamic'

interface ProyectoLey {
    boletin: string
    titulo: string
    fecha_ingreso: string
    estado?: string
    etapa?: string
    camara_origen?: string
    iniciativa?: string
}

export default async function LegislativoPage() {
    const supabase = await createLegislativoClient()

    // Debug: Check client creation
    console.log("LegislativoPage: Fetching projects...")

    // Obtener proyectos (limitamos a 200 para el dashboard inicial)
    const { data: proyectosRaw, error } = await supabase
        .from('proyectos_ley')
        .select('boletin, titulo, fecha_ingreso, estado, etapa, camara_origen, iniciativa')
        .limit(200)
        .order('fecha_ingreso', { ascending: false })

    if (error) {
        console.error("LegislativoPage Error:", error)
    } else {
        console.log(`LegislativoPage Success: Fetched ${proyectosRaw?.length} projects`)
    }

    const proyectos = (proyectosRaw || []) as unknown as ProyectoLey[]

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                        <Landmark className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                        Congreso Nacional
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Seguimiento de la actividad legislativa de la Cámara de Diputados y el Senado.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-500" /> Proyectos Recientes
                    </h3>
                    <p className="text-3xl font-bold">{proyectos.length}+</p>
                    <p className="text-sm text-muted-foreground">Monitorizando nuevos ingresos</p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Vote className="w-5 h-5 text-purple-500" /> Votaciones
                    </h3>
                    <p className="text-3xl font-bold">Activo</p>
                    <p className="text-sm text-muted-foreground">Registro de sala actualizado</p>
                </div>
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        Parlamentarios
                    </h3>
                    <p className="text-3xl font-bold">100%</p>
                    <p className="text-sm text-muted-foreground">Cobertura completa</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Explorador de Proyectos</h2>

            <LegislativeList initialProjects={proyectos} />

        </div>
    )
}
