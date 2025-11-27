import { MonitorDashboard } from "@/components/monitor/MonitorDashboard";

export default function MonitorPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Monitor de Compras Públicas</h1>
                <p className="text-muted-foreground text-lg">
                    Visualización en tiempo real del gasto público y licitaciones del Estado.
                </p>
            </div>

            <MonitorDashboard />
        </div>
    );
}
