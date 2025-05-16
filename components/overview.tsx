"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    impressions: 2400,
  },
  {
    name: "Feb",
    impressions: 1398,
  },
  {
    name: "Mar",
    impressions: 9800,
  },
  {
    name: "Apr",
    impressions: 3908,
  },
  {
    name: "May",
    impressions: 4800,
  },
  {
    name: "Jun",
    impressions: 3800,
  },
  {
    name: "Jul",
    impressions: 4300,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="impressions" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
