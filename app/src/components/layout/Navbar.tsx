"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { BarChart3, Menu, X, Heart, ChevronDown, Building2, HeartPulse, GraduationCap, Landmark } from "lucide-react"
import { useState } from "react"
import { SearchCommand } from "@/components/layout/SearchCommand"
import { ModeToggle } from "@/components/ui/ModeToggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <span>DatoPúblico<span className="text-primary">.cl</span></span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Inicio
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                                Datos <ChevronDown className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/datos/compras" className="flex items-center gap-2 cursor-pointer">
                                        <Building2 className="w-4 h-4 text-blue-500" />
                                        <span>Compras Públicas</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/datos/legislativo" className="flex items-center gap-2 cursor-pointer">
                                        <Landmark className="w-4 h-4 text-purple-500" />
                                        <span>Congreso</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/datos/salud" className="flex items-center gap-2 cursor-pointer">
                                        <HeartPulse className="w-4 h-4 text-green-500" />
                                        <span>Salud</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/datos/educacion" className="flex items-center gap-2 cursor-pointer">
                                        <GraduationCap className="w-4 h-4 text-amber-500" />
                                        <span>Educación</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/estudios" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Estudios
                        </Link>
                        <Link href="/noticias" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Noticias
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <SearchCommand />
                        <ModeToggle />
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors" asChild>
                            <Link href="/aportes">
                                <Heart className="w-4 h-4 mr-2 fill-current" />
                                Aportar
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background p-4 space-y-4 animate-in slide-in-from-top-5">
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Inicio
                        </Link>

                        <div className="space-y-2 pl-2">
                            <div className="text-sm font-semibold text-foreground px-2">Datos</div>
                            <Link
                                href="/datos/compras"
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md pl-4"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Building2 className="w-4 h-4" /> Compras Públicas
                            </Link>
                            <Link
                                href="/datos/legislativo"
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md pl-4"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Landmark className="w-4 h-4" /> Congreso
                            </Link>
                            <Link
                                href="/datos/salud"
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md pl-4"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <HeartPulse className="w-4 h-4" /> Salud
                            </Link>
                            <Link
                                href="/datos/educacion"
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md pl-4"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <GraduationCap className="w-4 h-4" /> Educación
                            </Link>
                        </div>

                        <Link
                            href="/estudios"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Estudios
                        </Link>
                        <Link
                            href="/noticias"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Noticias
                        </Link>

                        <div className="flex flex-col gap-2 pt-4 border-t">
                            <Button variant="outline" className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-white" asChild>
                                <Link href="/aportes">
                                    <Heart className="w-4 h-4 mr-2 fill-current" />
                                    Aportar
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
