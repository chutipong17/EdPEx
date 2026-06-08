import { KpiCard } from './kpi-card'
import type { KpiSummary } from '@/types/dashboard'
import { ListChecks, CircleCheck, CircleAlert, CircleHelp } from 'lucide-react'

export function KpiSummaryCards({ summary }: { summary: KpiSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
      <KpiCard
        label="จำนวนตัวชี้วัดทั้งหมด"
        value={summary.total}
        icon={ListChecks}
        tone="primary"
      />
      <KpiCard
        label="บรรลุเป้าหมาย"
        value={summary.achieved}
        icon={CircleCheck}
        tone="success"
      />
      <KpiCard
        label="ยังไม่บรรลุเป้าหมาย"
        value={summary.notAchieved}
        icon={CircleAlert}
        tone="warning"
      />
      <KpiCard label="ไม่มีข้อมูล" value={summary.noData} icon={CircleHelp} tone="danger" />
    </div>
  )
}
