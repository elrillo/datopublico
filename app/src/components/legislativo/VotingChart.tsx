"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

interface VotingChartProps {
    si: number
    no: number
    abstencion: number
    pareo?: number
}

export function VotingChart({ si, no, abstencion, pareo = 0 }: VotingChartProps) {
    const data = [
        { name: "A Favor", value: si, color: "#22c55e" }, // Green
        { name: "En Contra", value: no, color: "#ef4444" }, // Red
        { name: "Abstención", value: abstencion, color: "#eab308" }, // Yellow
        { name: "Pareo", value: pareo, color: "#94a3b8" }  // Gray
    ].filter(d => d.value > 0)

    if (data.length === 0) return <div className="text-muted-foreground text-sm">Sin datos numéricos</div>

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 80, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
