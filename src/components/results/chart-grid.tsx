import { ChartCard } from "@/components/results/chart-card"
import type { IndicatorGraph } from "@/types/indicator-graph"

interface ChartGridProps {
  indicators:IndicatorGraph []
  chartType: string
}

export function ChartGrid({ indicators, chartType }: ChartGridProps) {
  if (indicators.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border">
        <p className="text-sm text-muted-foreground">
          ไม่พบตัวชี้วัดที่ตรงกับเงื่อนไขการค้นหา
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {indicators.map((indicator) => (
        <ChartCard
          key={indicator.id}
          indicator={indicator}
          chartType={chartType}
        />
      ))}
    </div>
  )
}
