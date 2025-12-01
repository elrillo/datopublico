'use client'

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { BarChart3, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function AdminHeader() {
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <BarChart3 className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">DatoPúblico Admin</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/admin" className="transition-colors hover:text-foreground/80 text-foreground">
                            Dashboard
                        </Link>
                        <Link href="/admin/noticias" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Noticias
                        </Link>
                        <Link href="/admin/usuarios" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Usuarios
                        </Link>
                    </nav>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </header>
    )
}
