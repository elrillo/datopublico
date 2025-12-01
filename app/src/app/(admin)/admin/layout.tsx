import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/AdminHeader"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const allowedRoles = ['admin', 'editor', 'writer']
    if (!profile || !allowedRoles.includes(profile.role)) {
        redirect("/unauthorized")
    }

    return (
        <div className="flex min-h-screen flex-col">
            <AdminHeader />
            <main className="flex-1">{children}</main>
        </div>
    )
}


