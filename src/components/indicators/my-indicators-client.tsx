'use client'

import { useMemo } from 'react'
import { IndicatorTable } from '@/components/indicators/indicator-table'
import { useGetKpi } from '@/service/kpi/kpi'
import type { Indicator } from '@/types/indicator-Edpx'

interface MyIndicatorsClientProps {
  userDepartment: string
  role: 'USER' | 'ADMIN' | 'EXECUTIVE'
}

export function MyIndicatorsClient({
  userDepartment,
  role,
}: MyIndicatorsClientProps) {

  
  const {
    data: kpiResponse,
    isLoading,
    error: isError,
  } = useGetKpi()

  console.log('DATA === kpiResponse', kpiResponse)
  console.log('USER DEPARTMENT ===', userDepartment)
  console.log('USER ROLE ===', role)

  const indicators = useMemo<Indicator[]>(() => {
    const kpis = kpiResponse?.data ?? []

    if (!Array.isArray(kpis)) {
      return []
    }

    let filteredKpis = kpis

    // ============================================
    // ADMIN / EXECUTIVE
    // เห็น KPI ทั้งหมด
    // ============================================
    if (
      role === 'ADMIN' 
    ) {
      filteredKpis = kpis
    }

    // ============================================
    // USER
    // เห็นเฉพาะ KPI ใน Department ของตัวเอง
    // ============================================
    else {
      if (!userDepartment) {
        return []
      }

      filteredKpis = kpis.filter((kpi: any) => {
        return (
          String(kpi.departmentName ?? '')
            .trim()
            .toLowerCase() ===
          String(userDepartment)
            .trim()
            .toLowerCase()
        )
      })
    }

    console.log(
      'FILTERED KPI ===',
      filteredKpis,
    )

    return filteredKpis.map(
      (kpi: any): Indicator => ({
        // ==========================================
        // Basic
        // ==========================================
        id: kpi.id,

        firstName:
          kpi.firstName ?? '',

        lastName:
          kpi.lastName ?? '',

        frequencyId:
          kpi.frequencyId,

        departmentName:
          kpi.departmentName ?? '',

        // ==========================================
        // KPI
        // ==========================================
        kpiCode:
          kpi.kpiCode ?? '',

        kpiName:
          kpi.kpiName ?? '',

        description:
          kpi.description ?? '',

        targetValue:
          Number(kpi.targetValue ?? 0),

        // ==========================================
        // Frequency
        // ==========================================
        frequency: {
          frequencyName:
            kpi.frequency?.frequencyName ??
            '',
        },

        // ==========================================
        // Indicator
        // ==========================================
        year:
          String(kpi.year ?? ''),

        indicatorType:
          kpi.kpiCategory?.categoryName ??
          'ตัวชี้วัด EdPEx',

        code:
          kpi.kpiCode ?? '',

        name:
          kpi.kpiName ?? '',

        department:
          kpi.departmentName ?? '',

        owner:
          `${kpi.firstName ?? ''} ${
            kpi.lastName ?? ''
          }`.trim(),

        // ==========================================
        // Data type
        // ==========================================
        dataType:
          kpi.dataType ?? 'ปริมาณ',

        // ==========================================
        // Target condition
        // ==========================================
        targetCondition:
          kpi.targetCondition?.conditionName ??
          'มากกว่าหรือเท่ากับ',

        target:
          Number(kpi.targetValue ?? 0),

        unit:
          kpi.unit ?? '',

        // ==========================================
        // Result
        // ==========================================
        result:
          kpi.resultValue != null
            ? Number(kpi.resultValue)
            : null,

        status:
          'warning',

        // ==========================================
        // Collection period
        // ==========================================
        collectionPeriod:
          kpi.frequency?.frequencyName ??
          'รายเดือน',

        // ==========================================
        // Month
        //
        // API:
        // monthOfDelivery: {
        //   id: 11,
        //   name: 'พฤศจิกายน',
        //   value: '11'
        // }
        //
        // Indicator ต้องการ string[]
        // ==========================================
        months:
          kpi.monthOfDelivery?.name
            ? [kpi.monthOfDelivery.name]
            : [],

        // ==========================================
        // Collectors
        // ==========================================
        collectors:
          Array.isArray(kpi.collectors)
            ? kpi.collectors.map(
                (collector: any) => ({
                  name:
                    collector.name ?? '',

                  result:
                    collector.result ?? '',
                }),
              )
            : [],

        // ==========================================
        // KPI Category
        // ==========================================
        kpiCategory: {
          categoryName:
            kpi.kpiCategory?.categoryName ??
            '',
        },

        // ==========================================
        // Assignment
        // ==========================================
        kpiAssignment:
          Array.isArray(kpi.kpiAssignment)
            ? kpi.kpiAssignment
            : [],

        // ==========================================
        // Submission
        // ==========================================
        submission:
          Array.isArray(kpi.submission)
            ? kpi.submission
            : [],

            getSubmission:  Array.isArray(kpi.submission)
            ? kpi.submission
            : [],

      }),
    )
  }, [
    kpiResponse,
    userDepartment,
    role,
  ])

  return (
    <div className="flex flex-col gap-5">
      {/* ==========================================
          Header
      ========================================== */}
      <div>
        <h1 className="text-2xl font-semibold text-info">
          รายการตัวชี้วัด
        </h1>

        <p className="text-sm text-muted-foreground">
          ตัวชี้วัดที่อยู่ในความรับผิดชอบของคุณ (
          {indicators.length} รายการ)
        </p>
      </div>

      {/* ==========================================
          Table
      ========================================== */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        {isLoading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            กำลังโหลดข้อมูล...
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-sm text-destructive">
            ไม่สามารถโหลดข้อมูลตัวชี้วัดได้
          </div>
        ) : indicators.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            ไม่พบข้อมูลตัวชี้วัด
          </div>
        ) : (
          <IndicatorTable
            indicators={indicators}
          />
        )}
      </div>
    </div>
  )
}