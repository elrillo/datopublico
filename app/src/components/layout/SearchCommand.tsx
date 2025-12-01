"use client"

import * as React from "react"
import {
    BarChart3,
    HeartPulse,
    GraduationCap,
    Newspaper,
    Home,
    Info,
    Mail,
    FileText,
    Search
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/Command"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"

export function SearchCommand() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 text-muted-foreground"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Buscar...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Escribe un comando o busca..." />
                <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup heading="Navegación">
                        <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
                            <Home className="mr-2 h-4 w-4" />
                            <span>Inicio</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/compras"))}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Compras Públicas</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/salud"))}>
                            <HeartPulse className="mr-2 h-4 w-4" />
                            <span>Salud</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/educacion"))}>
                            <GraduationCap className="mr-2 h-4 w-4" />
                            <span>Educación</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/noticias"))}>
                            <Newspaper className="mr-2 h-4 w-4" />
                            <span>Noticias</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Información">
                        <CommandItem onSelect={() => runCommand(() => router.push("/nosotros"))}>
                            <Info className="mr-2 h-4 w-4" />
                            <span>Sobre Nosotros</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/metodologia"))}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Metodología</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/contacto"))}>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Contacto</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/aportes"))}>
                            <HeartPulse className="mr-2 h-4 w-4" />
                            <span>Aportes</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
