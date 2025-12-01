import { createClient } from "@/lib/supabase/server"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Mail, Eye } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default async function MensajesPage() {
    const supabase = await createClient()
    const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Mensajes de Contacto</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bandeja de Entrada</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Asunto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {messages?.map((msg) => (
                                <TableRow key={msg.id}>
                                    <TableCell>{new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{msg.name}</span>
                                            <span className="text-xs text-muted-foreground">{msg.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[300px] truncate" title={msg.subject}>
                                            {msg.subject}
                                        </div>
                                        <div className="max-w-[300px] truncate text-xs text-muted-foreground" title={msg.message}>
                                            {msg.message}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={msg.status === 'unread' ? 'default' : 'secondary'}>
                                            {msg.status === 'unread' ? 'No leído' : 'Leído'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/mensajes/${msg.id}`}>
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!messages || messages.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No hay mensajes recibidos.
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
