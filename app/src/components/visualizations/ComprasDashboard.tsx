"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { formatCurrency } from "@/lib/utils";

// Define the type based on the ETL script
export interface OrdenCompra {
    codigo: string;
    fecha: string;
    organismo: string;
    monto: number;
    moneda: string;
    estado: string;
    tipo: string;
    descripcion: string;
    sector: string;
    proveedor_rut?: string;
    proveedor_nombre?: string;
}

interface ComprasDashboardProps {
    initialData: OrdenCompra[];
    defaultSector?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function ComprasDashboard({ initialData, defaultSector = "todos" }: ComprasDashboardProps) {
    const [selectedSector, setSelectedSector] = useState<string>(defaultSector);

    // Get unique sectors
    const sectors = useMemo(() => {
        const uniqueSectors = Array.from(new Set(initialData.map(item => item.sector).filter(Boolean)));
        return uniqueSectors.sort();
    }, [initialData]);

    // Filter data
    const filteredData = useMemo(() => {
        if (selectedSector === "todos") return initialData;
        return initialData.filter(item => item.sector === selectedSector);
    }, [initialData, selectedSector]);

    // Calculate KPIs
    const kpis = useMemo(() => {
        const totalMonto = filteredData.reduce((sum, item) => sum + (item.monto || 0), 0);
        const totalOrdenes = filteredData.length;
        const uniqueOrganismos = new Set(filteredData.map(item => item.organismo)).size;

        return {
            totalMonto,
            totalOrdenes,
            uniqueOrganismos
        };
    }, [filteredData]);

    // Prepare data for charts
    const chartsData = useMemo(() => {
        // Top Organismos by Monto
        const organismosMap = new Map<string, number>();
        filteredData.forEach(item => {
            const current = organismosMap.get(item.organismo) || 0;
            organismosMap.set(item.organismo, current + (item.monto || 0));
        });

        const topOrganismos = Array.from(organismosMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        // Monto by Sector (for Pie Chart)
        const sectorMap = new Map<string, number>();
        filteredData.forEach(item => {
            const sector = item.sector || "Sin Clasificar";
            const current = sectorMap.get(sector) || 0;
            sectorMap.set(sector, current + (item.monto || 0));
        });

        const sectorData = Array.from(sectorMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Timeline (Daily)
        const dateMap = new Map<string, number>();
        filteredData.forEach(item => {
            if (!item.fecha) return;
            const date = new Date(item.fecha).toLocaleDateString('es-CL');
            const current = dateMap.get(date) || 0;
            dateMap.set(date, current + (item.monto || 0));
        });

        // Sort by date (needs actual date object for sorting)
        const timelineData = Array.from(dateMap.entries())
            .map(([date, value]) => ({ date, value }))
            // Simple string sort for DD-MM-YYYY might be wrong, better to use ISO for sorting
            // But for now let's just rely on the input order if it's sorted, or sort by parsing
            .sort((a, b) => {
                const [da, ma, ya] = a.date.split('-').map(Number);
                const [db, mb, yb] = b.date.split('-').map(Number);
                return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
            });

        return {
            topOrganismos,
            sectorData,
            timelineData
        };
    }, [filteredData]);

    const formatCLP = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex justify-end">
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Filtrar por Sector" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los Sectores</SelectItem>
                        {sectors.map(sector => (
                            <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCLP(kpis.totalMonto)}</div>
                        <p className="text-xs text-muted-foreground">En el periodo seleccionado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpis.totalOrdenes}</div>
                        <p className="text-xs text-muted-foreground">Transacciones procesadas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Organismos Activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpis.uniqueOrganismos}</div>
                        <p className="text-xs text-muted-foreground">Instituciones compradoras</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Top 5 Organismos (Monto)</CardTitle>
                        <CardDescription>Instituciones con mayor gasto en el periodo</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartsData.topOrganismos} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(value: number) => formatCLP(value)} />
                                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Distribución por Sector</CardTitle>
                        <CardDescription>Gasto total dividido por sector</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartsData.sectorData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartsData.sectorData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCLP(value)} />
                                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <Card>
                <CardHeader>
                    <CardTitle>Evolución del Gasto</CardTitle>
                    <CardDescription>Monto total de compras por día</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartsData.timelineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => formatCLP(value)} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
