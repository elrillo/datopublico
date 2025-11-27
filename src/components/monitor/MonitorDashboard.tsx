"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowUpRight, Building2, DollarSign, FileText } from "lucide-react";

const data = [
    { name: "Ministerio de Salud", total: 45000000 },
    { name: "MOP", total: 32000000 },
    { name: "Carabineros", total: 21000000 },
    { name: "Gendarmería", total: 15000000 },
    { name: "Municipalidad de Santiago", total: 12000000 },
];

const recentTransactions = [
    { id: 1, organismo: "Ministerio de Salud", monto: 1250000, fecha: "2023-11-25", tipo: "Licitación Pública" },
    { id: 2, organismo: "MOP", monto: 5400000, fecha: "2023-11-24", tipo: "Trato Directo" },
    { id: 3, organismo: "Municipalidad de Providencia", monto: 890000, fecha: "2023-11-24", tipo: "Compra Ágil" },
    { id: 4, organismo: "Servicio de Impuestos Internos", monto: 3200000, fecha: "2023-11-23", tipo: "Licitación Pública" },
    { id: 5, organismo: "Hospital Regional", monto: 15000000, fecha: "2023-11-23", tipo: "Gran Compra" },
];

export function MonitorDashboard() {
    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <KpiCard
                    title="Monto Total Transado (24h)"
                    value="$125.4M"
                    change="+12%"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                />
                <KpiCard
                    title="Licitaciones Activas"
                    value="342"
                    change="+5%"
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                />
                <KpiCard
                    title="Organismos Activos"
                    value="56"
                    change="+2"
                    icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Gasto por Organismo</CardTitle>
                        <CardDescription>Top 5 organismos con mayor gasto esta semana.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => value.split(' ')[0]} // Shorten names
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value / 1000000}M`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions List */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Últimas Transacciones</CardTitle>
                        <CardDescription>Movimientos recientes en tiempo real.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 border-border/50">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none truncate max-w-[180px]">{t.organismo}</p>
                                        <p className="text-xs text-muted-foreground">{t.tipo}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">${t.monto.toLocaleString('es-CL')}</p>
                                        <p className="text-xs text-muted-foreground">{t.fecha}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function KpiCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <span className="text-emerald-500 flex items-center mr-1">
                        {change} <ArrowUpRight className="h-3 w-3 ml-0.5" />
                    </span>
                    vs mes anterior
                </p>
            </CardContent>
        </Card>
    );
}
