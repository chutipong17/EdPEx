// import { DashboardLayout } from '@/components/layout/dashboard-layout'
// import { DashboardFilters } from '@/components/dashboard/dashboard-filters'
// import { KpiSummaryCards } from '@/components/dashboard/kpi-summary'
// import { PerformancePieChart } from '@/components/dashboard/performance-pie-chart'
// import { IndicatorTable } from '@/components/dashboard/indicator-table'
// import { IndicatorAnalysisChart } from '@/components/dashboard/indicator-analysis-chart'
// import {
//   analysisData,
//   analysisIndicatorOptions,
//   branchOptions,
//   departmentOptions,
//   indicators,
//   indicatorTypeOptions,
//   kpiSummary,
//   pieData,
//   yearOptions,
// } from '@/lib/mock-data'
// import { redirect } from 'next/navigation'
// import { auth } from '@/lib/auth'

// export default async function DashboardPage() {
//      const session = await auth()
//       if (!session) {
//         redirect('/login')
//       }
//   return (
//     <DashboardLayout user={session.user}>
//       <div className="flex flex-col gap-6">
//         {/* Page header */}
//         <header>
//           <h1 className="text-balance text-3xl font-semibold text-foreground">
//             แดชบอร์ดสำหรับผู้บริหาร
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             ภาพรวมผลการดำเนินงานตัวชี้วัด
//           </p>
//         </header>

//         {/* Filters */}
//         <DashboardFilters
//           yearOptions={yearOptions}
//           indicatorTypeOptions={indicatorTypeOptions}
//           departmentOptions={departmentOptions}
//           branchOptions={branchOptions}
//         />

//         {/* KPI summary + pie chart */}
//         <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
//           <KpiSummaryCards summary={kpiSummary} />
//           <PerformancePieChart data={pieData} />
//         </div>

//         {/* Indicator detail table */}
//         <IndicatorTable data={indicators} />

//         {/* Per-indicator analysis */}
//         <IndicatorAnalysisChart
//           data={analysisData}
//           yearOptions={yearOptions}
//           indicatorTypeOptions={indicatorTypeOptions}
//           indicatorOptions={analysisIndicatorOptions}
//         />
//       </div>
//     </DashboardLayout>
//   )
// }

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DashboardData } from "@/components/dashboard/DashboardData";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/* =====================================================
   Filter Options
   ===================================================== */

const yearOptions = [
  { label: "ทั้งหมด", value: "all" },
  { label: "2570", value: "2570" },
  { label: "2569", value: "2569" },
  { label: "2568", value: "2568" },
  { label: "2567", value: "2567" },
  { label: "2566", value: "2566" },
];

const indicatorTypeOptions = [
  { label: "ทั้งหมด", value: "all" },
  { label: "ตัวชี้วัด กลยุทธ์", value: "3" },
  { label: "ตัวชี้วัดเชิงยุทธศาสตร์", value: "strategic" },
  { label: "ตัวชี้วัดเชิงปฏิบัติการ", value: "operational" },
  { label: "ตัวชี้วัดคุณภาพ", value: "quality" },
];

const departmentOptions = [
  { label: "ทั้งหมด", value: "all" },
];

const branchOptions = [
  { label: "ทั้งหมด", value: "all" },
];

/* =====================================================
   Dashboard Page
   ===================================================== */

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="flex flex-col gap-6">

        {/* =====================================================
            Page Header
        ===================================================== */}

        <header>
          <h1 className="text-balance text-3xl font-semibold text-foreground">
            แดชบอร์ดสำหรับผู้บริหาร
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            ภาพรวมผลการดำเนินงานตัวชี้วัด
          </p>
        </header>

        {/* =====================================================
            Filters
        ===================================================== */}

        <DashboardFilters
          yearOptions={yearOptions}
          indicatorTypeOptions={indicatorTypeOptions}
          departmentOptions={departmentOptions}
          branchOptions={branchOptions}
        />

        {/* =====================================================
            API Dashboard Data
        ===================================================== */}

        <DashboardData
          yearOptions={yearOptions}
          indicatorTypeOptions={indicatorTypeOptions}
        />

      </div>
    </DashboardLayout>
  );
}