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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Calendar, Loader2, Plus, Save, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { createNewUser } from "@/app/actions/users"

type Profile = {
    id: string
    email: string
    full_name: string
    avatar_url: string
    role: 'admin' | 'editor' | 'writer' | 'member' | 'user'
    created_at: string
    membership_expires_at: string | null
}

export default function UsersPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [creating, setCreating] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching users:', error)
            toast.error('Error al cargar usuarios')
        } else {
            setUsers(data as Profile[])
        }
        setLoading(false)
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdating(userId)
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId)

        if (error) {
            console.error('Error updating role:', error)
            toast.error('Error al actualizar el rol')
        } else {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u))

            // Log audit
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('audit_logs').insert({
                    user_id: user.id,
                    action: 'update',
                    entity: 'user',
                    entity_id: userId,
                    details: { field: 'role', value: newRole }
                })
            }

            toast.success('Rol actualizado')
        }
        setUpdating(null)
    }

    const handleExpirationChange = async (userId: string, date: string) => {
        setUpdating(userId)
        const { error } = await supabase
            .from('profiles')
            .update({ membership_expires_at: date || null })
            .eq('id', userId)

        if (error) {
            console.error('Error updating expiration:', error)
            toast.error('Error al actualizar fecha')
        } else {
            setUsers(users.map(u => u.id === userId ? { ...u, membership_expires_at: date || null } : u))

            // Log audit
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('audit_logs').insert({
                    user_id: user.id,
                    action: 'update',
                    entity: 'user',
                    entity_id: userId,
                    details: { field: 'membership_expires_at', value: date }
                })
            }

            toast.success('Membresía actualizada')
        }
        setUpdating(null)
    }

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCreating(true)
        const formData = new FormData(e.currentTarget)

        // Calculate expiration if duration is selected
        const duration = formData.get('duration') as string
        if (duration && duration !== 'none') {
            const date = new Date()
            date.setMonth(date.getMonth() + parseInt(duration))
            formData.append('membership_expires_at', date.toISOString())
        }

        const result = await createNewUser(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            // Log audit
            const { data: { user } } = await supabase.auth.getUser()
            if (user && result.userId) {
                await supabase.from('audit_logs').insert({
                    user_id: user.id,
                    action: 'create',
                    entity: 'user',
                    entity_id: result.userId,
                    details: { email: formData.get('email') }
                })
            }

            toast.success('Usuario creado exitosamente')
            setIsDialogOpen(false)
            fetchUsers() // Refresh list
        }
        setCreating(false)
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
                    <p className="text-muted-foreground">
                        Administra los roles y permisos de los usuarios registrados.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                            <DialogDescription>
                                Crea una cuenta manualmente.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" name="email" type="email" required placeholder="usuario@ejemplo.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nombre Completo</Label>
                                <Input id="fullName" name="fullName" placeholder="Juan Pérez" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña Temporal</Label>
                                <Input id="password" name="password" type="password" required minLength={6} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Rol Inicial</Label>
                                    <Select name="role" defaultValue="user">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="writer">Escritor</SelectItem>
                                            <SelectItem value="member">Miembro (Pago)</SelectItem>
                                            <SelectItem value="user">Usuario (Gratis)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duración Membresía</Label>
                                    <Select name="duration" defaultValue="none">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin vencimiento / N/A</SelectItem>
                                            <SelectItem value="1">1 Mes</SelectItem>
                                            <SelectItem value="3">3 Meses</SelectItem>
                                            <SelectItem value="6">6 Meses</SelectItem>
                                            <SelectItem value="12">1 Año</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={creating}>
                                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Crear Usuario
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usuarios</CardTitle>
                    <CardDescription>
                        Lista de todos los usuarios registrados en la plataforma.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Vencimiento Membresía</TableHead>
                                <TableHead>Fecha Registro</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar_url} />
                                            <AvatarFallback>{user.full_name?.[0] || user.email?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.full_name || 'Sin nombre'}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={user.role}
                                            onValueChange={(val) => handleRoleChange(user.id, val)}
                                            disabled={updating === user.id}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="writer">Escritor</SelectItem>
                                                <SelectItem value="member">Miembro</SelectItem>
                                                <SelectItem value="user">Usuario</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {user.role === 'member' ? (
                                                <Input
                                                    type="date"
                                                    className="w-[160px] h-8 text-xs"
                                                    value={user.membership_expires_at ? user.membership_expires_at.split('T')[0] : ''}
                                                    onChange={(e) => handleExpirationChange(user.id, e.target.value)}
                                                />
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
