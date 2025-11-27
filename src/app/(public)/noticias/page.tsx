export default function NoticiasPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Noticias</h1>
                <p className="text-muted-foreground text-lg">
                    Análisis y reportajes sobre el gasto público en Chile.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for news cards */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <p className="text-muted-foreground">Próximamente: Artículos y reportajes.</p>
                </div>
            </div>
        </div>
    );
}
