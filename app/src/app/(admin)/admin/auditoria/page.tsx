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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

type AuditLog = {
    id: string
    user_id: string
    action: string
    entity: string
    entity_id: string
    details: any
    created_at: string
    user_email?: string // Joined manually or via view
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        setLoading(true)
        // Fetch logs and profiles manually since we can't join auth.users easily from client without a view/function
        // But we can join public.profiles if we link them.
        // For now, let's just fetch logs and maybe profiles separately or assume user_id is enough for MVP
        // Actually, let's try to fetch profiles to show email/name

        const { data: logsData, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Error fetching logs:', error)
            toast.error('Error al cargar registros')
        } else if (logsData) {
            // Fetch user emails from profiles
            const userIds = Array.from(new Set(logsData.map(l => l.user_id)))
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, email')
                .in('id', userIds)

            const profileMap = new Map(profiles?.map(p => [p.id, p.email]))

            const enrichedLogs = logsData.map(log => ({
                ...log,
                user_email: profileMap.get(log.user_id) || 'Usuario desconocido'
            }))

            setLogs(enrichedLogs)
        }
        setLoading(false)
    }

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'create': return <Badge variant="default" className="bg-green-600">Crear</Badge>
            case 'update': return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Actualizar</Badge>
            case 'delete': return <Badge variant="destructive">Eliminar</Badge>
            default: return <Badge variant="outline">{action}</Badge>
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Logs de Auditoría</h2>
                <p className="text-muted-foreground">
                    Registro de actividades y cambios en la plataforma.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>
                        Últimos 50 eventos registrados.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Acción</TableHead>
                                <TableHead>Entidad</TableHead>
                                <TableHead>Detalles</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {log.user_email}
                                    </TableCell>
                                    <TableCell>
                                        {getActionBadge(log.action)}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {log.entity}
                                    </TableCell>
                                    <TableCell className="text-xs font-mono text-muted-foreground max-w-[300px] truncate">
                                        {JSON.stringify(log.details)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No hay registros de actividad.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
