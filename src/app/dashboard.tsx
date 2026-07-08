import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardFilters } from '@/components/dashboard/dashboard-filters'
import { KpiSummaryCards } from '@/components/dashboard/kpi-summary'
import { PerformancePieChart } from '@/components/dashboard/performance-pie-chart'
import { IndicatorTable } from '@/components/dashboard/indicator-table'
import { IndicatorAnalysisChart } from '@/components/dashboard/indicator-analysis-chart'
import {
  analysisData,
  analysisIndicatorOptions,
  branchOptions,
  departmentOptions,
  indicators,
  indicatorTypeOptions,
  kpiSummary,
  pieData,
  yearOptions,
} from '@/lib/mock-data'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function DashboardPage() {
     const session = await auth()
      if (!session) {
        redirect('/login')
      }
  return (
    <DashboardLayout user={session.user}>
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <header>
          <h1 className="text-balance text-3xl font-semibold text-foreground">
            แดชบอร์ดสำหรับผู้บริหาร
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ภาพรวมผลการดำเนินงานตัวชี้วัด
          </p>
        </header>

        {/* Filters */}
        <DashboardFilters
          yearOptions={yearOptions}
          indicatorTypeOptions={indicatorTypeOptions}
          departmentOptions={departmentOptions}
          branchOptions={branchOptions}
        />

        {/* KPI summary + pie chart */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
          <KpiSummaryCards summary={kpiSummary} />
          <PerformancePieChart data={pieData} />
        </div>

        {/* Indicator detail table */}
        <IndicatorTable data={indicators} />

        {/* Per-indicator analysis */}
        <IndicatorAnalysisChart
          data={analysisData}
          yearOptions={yearOptions}
          indicatorTypeOptions={indicatorTypeOptions}
          indicatorOptions={analysisIndicatorOptions}
        />
      </div>
    </DashboardLayout>
  )
}
