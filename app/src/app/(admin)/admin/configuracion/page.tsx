'use client'

import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

export default function SiteSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    const [settings, setSettings] = useState({
        site_name: '',
        site_description: '',
        contact_email: '',
        social_twitter: '',
        social_instagram: ''
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .single()

        if (error) {
            console.error('Error fetching settings:', error)
            // If no settings found, we might need to insert default or just handle empty
        } else if (data) {
            setSettings({
                site_name: data.site_name || '',
                site_description: data.site_description || '',
                contact_email: data.contact_email || '',
                social_twitter: data.social_twitter || '',
                social_instagram: data.social_instagram || ''
            })
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            // Update settings
            const { error } = await supabase
                .from('site_settings')
                .update(settings)
                .eq('id', 1)

            if (error) throw error

            // Log audit
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('audit_logs').insert({
                    user_id: user.id,
                    action: 'update',
                    entity: 'settings',
                    entity_id: '1',
                    details: { updated_fields: Object.keys(settings) }
                })
            }

            toast.success('Configuración actualizada')
        } catch (error) {
            console.error('Error updating settings:', error)
            toast.error('Error al guardar configuración')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuración del Sitio</h2>
                <p className="text-muted-foreground">
                    Personaliza la información general de la plataforma.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                    <CardDescription>
                        Datos visibles en el encabezado, pie de página y metadatos SEO.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="site_name">Nombre del Sitio</Label>
                                <Input
                                    id="site_name"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_email">Email de Contacto</Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={settings.contact_email}
                                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="site_description">Descripción (SEO)</Label>
                            <Textarea
                                id="site_description"
                                placeholder="Breve descripción del sitio para buscadores..."
                                value={settings.site_description}
                                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="twitter">Twitter / X URL</Label>
                                <Input
                                    id="twitter"
                                    placeholder="https://twitter.com/..."
                                    value={settings.social_twitter}
                                    onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram URL</Label>
                                <Input
                                    id="instagram"
                                    placeholder="https://instagram.com/..."
                                    value={settings.social_instagram}
                                    onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
