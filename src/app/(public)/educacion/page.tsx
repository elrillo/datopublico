"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowUpRight, Building2, DollarSign, FileText, GraduationCap } from "lucide-react";

const data = [
    { name: "U. de Chile", total: 65000000 },
    { name: "U. Católica", total: 52000000 },
    { name: "MINEDUC", total: 95000000 },
    { name: "JUNAEB", total: 45000000 },
    { name: "DAEM Santiago", total: 12000000 },
];

const recentTransactions = [
    { id: 1, organismo: "JUNAEB", monto: 12500000, fecha: "2023-11-25", tipo: "Alimentación Escolar" },
    { id: 2, organismo: "MINEDUC", monto: 5400000, fecha: "2023-11-24", tipo: "Textos Escolares" },
    { id: 3, organismo: "U. de Chile", monto: 890000, fecha: "2023-11-24", tipo: "Equipamiento Lab" },
    { id: 4, organismo: "DAEM Providencia", monto: 3200000, fecha: "2023-11-23", tipo: "Infraestructura" },
    { id: 5, organismo: "SLEP Barrancas", monto: 15000000, fecha: "2023-11-23", tipo: "Transporte" },
];

export default function EducacionPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Monitor de Educación</h1>
                <p className="text-muted-foreground text-lg">
                    Visualización del gasto en educación pública y subvenciones.
                </p>
            </div>

            <div className="space-y-8">
                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <KpiCard
                        title="Inversión en Infraestructura"
                        value="$85.2M"
                        change="+15%"
                        icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                    />
                    <KpiCard
                        title="Licitaciones Activas"
                        value="89"
                        change="+3%"
                        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    />
                    <KpiCard
                        title="Instituciones"
                        value="45"
                        change="+1"
                        icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Chart */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Gasto por Institución</CardTitle>
                            <CardDescription>Top 5 instituciones con mayor ejecución presupuestaria.</CardDescription>
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
                                            tickFormatter={(value) => value.split(' ')[0]}
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
                            <CardTitle>Últimas Compras Educación</CardTitle>
                            <CardDescription>Adquisiciones recientes del sector educación.</CardDescription>
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
