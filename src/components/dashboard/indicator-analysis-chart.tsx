'use client'

import { useState } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { AnalysisDatum, FilterOption } from '@/types/dashboard'

const seriesColors = {
  ubru: 'var(--chart-4)', // #4F7DF3
  target: 'var(--chart-1)', // #58C472
  q1: 'var(--chart-2)', // #FFC93D
  q2: 'var(--chart-3)', // #FF6B6B
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-semibold text-foreground">ปี {label}</p>
      <div className="flex flex-col gap-0.5">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: p.color }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="ml-auto font-medium text-foreground tabular-nums">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface AnalysisProps {
  data: AnalysisDatum[]
  yearOptions: FilterOption[]
  indicatorTypeOptions: FilterOption[]
  indicatorOptions: FilterOption[]
}

function MiniSelect({
  label,
  options,
}: {
  label: string
  options: FilterOption[]
}) {
  const [value, setValue] = useState(options[0]?.value ?? '')
  return (
    <div className="flex min-w-0 flex-col gap-1.5 w-full max-w-md">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={(v) => setValue(v ?? '')}>
        <SelectTrigger className="h-10 rounded-lg w-full" aria-label={label}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function IndicatorAnalysisChart({
  data,
  yearOptions,
  indicatorTypeOptions,
  indicatorOptions,
}: AnalysisProps) {
  return (
    <section className="flex min-h-[500px] flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">การวิเคราะห์ตัวชี้วัดรายตัว</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MiniSelect label="ปี" options={yearOptions} />
        <MiniSelect label="ประเภทตัวชี้วัด" options={indicatorTypeOptions} />
        <MiniSelect label="ตัวชี้วัด" options={indicatorOptions} />
      </div>

      <div className="mt-4 h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)', opacity: 0.4 }} />
            <Legend
              verticalAlign="top"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingBottom: 12 }}
            />
            <Bar dataKey="ubru" name="UBRU" fill={seriesColors.ubru} radius={[4, 4, 0, 0]} barSize={18} />
            <Bar dataKey="q1" name="Q1" fill={seriesColors.q1} radius={[4, 4, 0, 0]} barSize={18} />
            <Bar dataKey="q2" name="Q2" fill={seriesColors.q2} radius={[4, 4, 0, 0]} barSize={18} />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke={seriesColors.target}
              strokeWidth={2.5}
              dot={{ r: 4, fill: seriesColors.target }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
