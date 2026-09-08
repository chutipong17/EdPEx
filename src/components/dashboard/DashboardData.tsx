"use client";

import { useEffect, useMemo, useState } from "react";

import { KpiSummaryCards } from "@/components/dashboard/kpi-summary";
import { PerformancePieChart } from "@/components/dashboard/performance-pie-chart";
import { IndicatorTable } from "@/components/dashboard/indicator-table";
import { IndicatorAnalysisChart } from "@/components/dashboard/indicator-analysis-chart";
import {
  DashboardLoading,
  DashboardError} from "@/components/dashboard/DashboardState";

import { mapDashboardToPieData } from "@/components/dashboard/dashboard-pie";

import { useGetKpi } from "@/service/kpi/kpi";
import { useGetDashboard } from "@/service/dashboard/deshboard";

import {
  mapKpisToDashboardIndicators,
  mapKpisToAnalysisData,
  getAnalysisIndicatorOptions,
} from "@/lib/dashboard-mapper";

type FilterOption = {
  label: string;
  value: string;
};

interface DashboardDataProps {
  yearOptions: FilterOption[];
  indicatorTypeOptions: FilterOption[];
}

export function DashboardData({
  yearOptions,
  indicatorTypeOptions,
}: DashboardDataProps) {
  const [dashboardResponse, setDashboardResponse] =
    useState<any>(null);

  /* =====================================================
     KPI
  ===================================================== */

  const {
    data: kpiResponse,
    isLoading: kpiLoading,
    error: kpiError,
  } = useGetKpi();

  /* =====================================================
     Dashboard
     ใช้เฉพาะ Pie
  ===================================================== */

  const {
    mutateAsync: getDashboardData,
    isPending: dashboardLoading,
  } = useGetDashboard();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getDashboardData({
          body: {
            year: null,
            kpiCategoryId: null,
            departmentId: null,
          },
        });

        setDashboardResponse(response);
      } catch (error) {
        console.error(
          "Dashboard API Error:",
          error,
        );
      }
    };

    loadDashboard();
  }, [getDashboardData]);

  /* =====================================================
     KPI Data
  ===================================================== */

  const kpis = useMemo(() => {
    if (!kpiResponse) {
      return [];
    }

    if (Array.isArray(kpiResponse)) {
      return kpiResponse;
    }

    if (Array.isArray(kpiResponse?.data)) {
      return kpiResponse.data;
    }

    return [];
  }, [kpiResponse]);

  /* =====================================================
     Indicator
  ===================================================== */

  const indicators = useMemo(
    () => mapKpisToDashboardIndicators(kpis),
    [kpis],
  );

  /* =====================================================
     Summary
  ===================================================== */

 const kpiSummary = useMemo(
  () => ({
    total: dashboardResponse?.data?.total ?? 0,
    achieved: dashboardResponse?.data?.achieved ?? 0,
    notAchieved: dashboardResponse?.data?.notAchieved ?? 0,
    noData: dashboardResponse?.data?.noData ?? 0,
  }),
  [dashboardResponse],
);
  /* =====================================================
     Analysis
  ===================================================== */

  const analysisData = useMemo(
    () => mapKpisToAnalysisData(kpis),
    [kpis],
  );

  const analysisIndicatorOptions =
    useMemo(
      () =>
        getAnalysisIndicatorOptions(kpis),
      [kpis],
    );

  /* =====================================================
     Pie
  ===================================================== */

  const pieData = useMemo(
    () =>
      mapDashboardToPieData(
        dashboardResponse,
      ),
    [dashboardResponse],
  );

  /* =====================================================
     Loading
  ===================================================== */

  if (
    kpiLoading ||
    dashboardLoading
  ) {
    return <DashboardLoading />;
  }

  /* =====================================================
     Error
  ===================================================== */

  if (kpiError) {
    return <DashboardError type="kpi" />;
  }

  /* =====================================================
     Render
  ===================================================== */

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <KpiSummaryCards
          summary={kpiSummary}
        />

        <PerformancePieChart
          data={pieData}
        />
      </div>

      <IndicatorTable
        data={indicators}
      />

      <IndicatorAnalysisChart
        data={analysisData}
        yearOptions={yearOptions}
        indicatorTypeOptions={
          indicatorTypeOptions
        }
        indicatorOptions={
          analysisIndicatorOptions
        }
      />
    </>
  );
}