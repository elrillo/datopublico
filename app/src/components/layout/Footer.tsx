import Link from "next/link"
import { BarChart3, Github, Twitter, Mail, Instagram, Youtube } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-slate-50 dark:bg-slate-950/50 mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <span>DatoPúblico<span className="text-primary">.cl</span></span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Plataforma independiente de transparencia y análisis de datos públicos en Chile. Promovemos la fiscalización ciudadana a través de la tecnología.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Plataforma</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/compras" className="text-muted-foreground hover:text-primary transition-colors">
                                    Monitor de Compras
                                </Link>
                            </li>
                            <li>
                                <Link href="/salud" className="text-muted-foreground hover:text-primary transition-colors">
                                    Monitor de Salud
                                </Link>
                            </li>
                            <li>
                                <Link href="/educacion" className="text-muted-foreground hover:text-primary transition-colors">
                                    Monitor de Educación
                                </Link>
                            </li>
                            <li>
                                <Link href="/noticias" className="text-muted-foreground hover:text-primary transition-colors">
                                    Noticias y Reportajes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Institucional</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/nosotros" className="text-muted-foreground hover:text-primary transition-colors">
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="/metodologia" className="text-muted-foreground hover:text-primary transition-colors">
                                    Metodología y Fuentes
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                                    Acceso Funcionarios
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Contacto</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                contacto@datopublico.cl
                            </div>
                            <div className="flex gap-4">
                                <Link href="https://x.com/datopublicocl" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Twitter className="w-5 h-5" />
                                    <span className="sr-only">Twitter</span>
                                </Link>
                                <Link href="https://www.instagram.com/datopublico/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Instagram className="w-5 h-5" />
                                    <span className="sr-only">Instagram</span>
                                </Link>
                                <Link href="https://www.youtube.com/@DatoPublico" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Youtube className="w-5 h-5" />
                                    <span className="sr-only">YouTube</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} DatoPúblico.cl. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-foreground">Términos de Uso</Link>
                        <Link href="#" className="hover:text-foreground">Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
