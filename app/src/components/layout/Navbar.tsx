import Link from "next/link";
import { BarChart3, Newspaper, Home, Mail, Stethoscope, GraduationCap, ShoppingCart } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-md dark:bg-slate-950/70 dark:border-slate-800/50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <span>DatoPúblico<span className="text-primary">.cl</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <NavLink href="/" icon={<Home className="w-4 h-4" />} label="Inicio" />
                    <NavLink href="/compras" icon={<ShoppingCart className="w-4 h-4" />} label="Compras" />
                    <NavLink href="/salud" icon={<Stethoscope className="w-4 h-4" />} label="Salud" />
                    <NavLink href="/educacion" icon={<GraduationCap className="w-4 h-4" />} label="Educación" />
                    <NavLink href="/noticias" icon={<Newspaper className="w-4 h-4" />} label="Noticias" />
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Admin
                    </Link>
                    <Link
                        href="/compras"
                        className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Ver Datos
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
            {icon}
            {label}
        </Link>
    );
}
