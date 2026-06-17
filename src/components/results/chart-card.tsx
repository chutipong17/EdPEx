"use client"

import { Download } from "lucide-react"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { SERIES } from "@/lib/mock-data"
import type { IndicatorGraph } from "@/types/indicator-graph"

interface ChartCardProps {
  indicator: IndicatorGraph
  chartType: string
}

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-semibold text-foreground">ปี {label}</p>
      <ul className="space-y-0.5">
        {payload.map((item) => (
          <li key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-medium text-foreground">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ChartCard({ indicator, chartType }: ChartCardProps) {
  return (
    <article className="flex h-[300px] flex-col rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-xs font-medium text-foreground">
            {indicator.code}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {indicator.description}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-primary"
          aria-label={`ดาวน์โหลดข้อมูล ${indicator.code}`}
        >
          <Download className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-2 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={indicator.data}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              domain={[0, 6]}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            />
            <Legend
              verticalAlign="top"
              align="center"
              height={28}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11 }}
            />
            {SERIES.map((s) => {
              const showAsLine =
                chartType === "line" || (chartType !== "bar" && s.type === "line")
              if (showAsLine) {
                return (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                )
              }
              return (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={s.color}
                  radius={[3, 3, 0, 0]}
                  barSize={10}
                />
              )
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
