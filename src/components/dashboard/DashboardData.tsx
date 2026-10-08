"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardFilters } from "@/components/dashboard/dashboard-filters";

import { KpiSummaryCards } from "@/components/dashboard/kpi-summary";

import { PerformancePieChart } from "@/components/dashboard/performance-pie-chart";

import { IndicatorTable } from "@/components/dashboard/indicator-table";

import { IndicatorAnalysisChart } from "@/components/dashboard/indicator-analysis-chart";

import {
  DashboardLoading,
  DashboardError,
} from "@/components/dashboard/DashboardState";

import { mapDashboardToPieData } from "@/components/dashboard/dashboard-pie";

import { useGetKpi } from "@/service/kpi/kpi";

import { useGetDashboard } from "@/service/dashboard/deshboard";

import { useGetDepartments } from "@/service/department/department";

import { useGetKpiCategory } from "@/service/kpi-category/kpi-category";

import {
  mapKpisToDashboardIndicators,
  mapKpisToAnalysisData,
  getAnalysisIndicatorOptions,
} from "@/lib/dashboard-mapper";

import type { FilterOption } from "@/types/dashboard";

import type { DashboardFilterPayload } from "@/components/dashboard/dashboard-filters";
import ComparisonDashboard from "../results/comparison-dashboard";

/* =====================================================
   Props
===================================================== */

interface DashboardDataProps {
  yearOptions: FilterOption[];
  branchOptions: FilterOption[];
}

/* =====================================================
   Component
===================================================== */

export function DashboardData({
  yearOptions,
  branchOptions,
}: DashboardDataProps) {
  /* =====================================================
     Dashboard API Response
  ===================================================== */
  const [selectedFilters, setSelectedFilters] =
    useState<DashboardFilterPayload>({
      year: null,
      indicatorType: null,
      departmentName: null,
    });

  const [dashboardResponse, setDashboardResponse] = useState<any>(null);

  /* =====================================================
     KPI API
  ===================================================== */

  const {
    data: kpiResponse,
    isLoading: kpiLoading,
    error: kpiError,
  } = useGetKpi();

  /* =====================================================
     Dashboard API
  ===================================================== */

  const { mutateAsync: getDashboardData, isPending: dashboardLoading } =
    useGetDashboard();

  /* =====================================================
     Department API
  ===================================================== */

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useGetDepartments();

  /* =====================================================
     KPI Category API
  ===================================================== */

  const {
    data: kpiCategoryData,
    isLoading: kpiCategoryLoading,
    error: kpiCategoryError,
  } = useGetKpiCategory();

  /* =====================================================
     Department Options
  ===================================================== */

  const departmentOptions = useMemo(() => {
  const data = Array.isArray(departments)
    ? departments
    : departments?.data ?? [];

  return [
    {
      label: "ทั้งหมด",
      value: "all",
    },

    ...data.map((item: any) => ({
      label: item.departmentName ?? "-",
      value: String(item.id),
    })),
  ];
}, [departments]);

  /* =====================================================
     KPI Category Options
  ===================================================== */

 const indicatorTypeOptions = useMemo(() => {
  const data = Array.isArray(kpiCategoryData)
    ? kpiCategoryData
    : kpiCategoryData?.data ?? [];

  return [
    {
      label: "ทั้งหมด",
      value: "all",
    },

    ...data.map((item: any) => ({
      label: item.categoryName ?? "-",
      value: String(item.id),
    })),
  ];
}, [kpiCategoryData]);

  /* =====================================================
     Initial Dashboard API
  ===================================================== */

  useEffect(() => {
    const year = new Date().getFullYear() + 543
    const loadDashboard = async () => {
      try {
        const response = await getDashboardData({
          body: {
            year: year,
            kpiCategoryId: null,
            departmentId: null,
          },
        });

        console.log("Initial Dashboard API Response:", response);

        setDashboardResponse(response);
      } catch (error) {
        console.error("Dashboard API Error:", error);
      }
    };

    loadDashboard();
  }, [getDashboardData]);

  /* =====================================================
     Filter Search
  ===================================================== */

  const handleFilterSearch = async (filters: DashboardFilterPayload) => {
    try {
      console.log("Dashboard Filter:", filters);

      // เก็บค่าที่เลือกไว้
      setSelectedFilters(filters);

      const requestBody = {
        year: filters.year,
        kpiCategoryId: filters.indicatorType,
        departmentId: filters.departmentName,
      };

      console.log("Dashboard API Request Body:", requestBody);

      const response = await getDashboardData({
        body: requestBody,
      });

      console.log("Dashboard API Response:", response);

      setDashboardResponse(response);
    } catch (error) {
      console.error("Dashboard Filter API Error:", error);
    }
  };

 const selectedFilterText = useMemo(() => {
  const yearLabel =
    selectedFilters.year === null
      ? "ปัจจุบัน"
      : String(selectedFilters.year);

  const categoryData = Array.isArray(kpiCategoryData)
    ? kpiCategoryData
    : kpiCategoryData?.data ?? [];

  const departmentData = Array.isArray(departments)
    ? departments
    : departments?.data ?? [];

  const indicatorLabel =
    selectedFilters.indicatorType === null
      ? "ทั้งหมด"
      : categoryData.find(
          (item: any) =>
            Number(item.id) ===
            Number(selectedFilters.indicatorType),
        )?.categoryName ?? "ทั้งหมด";

  const departmentLabel =
    selectedFilters.departmentName === null
      ? "ทั้งหมด"
      : departmentData.find(
          (item: any) =>
            Number(item.id) ===
            Number(selectedFilters.departmentName),
        )?.departmentName ?? "ทั้งหมด";

  return {
    yearLabel,
    indicatorLabel,
    departmentLabel,
  };
}, [
  selectedFilters,
  kpiCategoryData,
  departments,
]);
  /* =====================================================
     KPI Data
  ===================================================== */

  const kpis = useMemo(() => {
    console.log("KPI API Response:", kpiResponse);
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
     Dashboard Indicators
  ===================================================== */

  const indicators = useMemo(() => mapKpisToDashboardIndicators(kpis), [kpis]);

  /* =====================================================
     KPI Summary
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
     Analysis Data
  ===================================================== */

  const analysisData = useMemo(() => mapKpisToAnalysisData(kpis), [kpis]);

  /* =====================================================
     Analysis Indicator Options
  ===================================================== */

  const analysisIndicatorOptions = useMemo(
    () => getAnalysisIndicatorOptions(kpis),
    [kpis],
  );

  /* =====================================================
     Pie Data
  ===================================================== */

  const pieData = useMemo(
    () => mapDashboardToPieData(dashboardResponse),
    [dashboardResponse],
  );

  /* =====================================================
     Loading
  ===================================================== */

  if (
    kpiLoading ||
    dashboardLoading ||
    departmentsLoading ||
    kpiCategoryLoading
  ) {
    return <DashboardLoading />;
  }

  /* =====================================================
     KPI Error
  ===================================================== */

  if (kpiError) {
    return <DashboardError type="kpi" />;
  }

  /* =====================================================
     Department Error
  ===================================================== */

  if (departmentsError) {
    console.error("Department API Error:", departmentsError);
  }

  /* =====================================================
     KPI Category Error
  ===================================================== */

  if (kpiCategoryError) {
    console.error("KPI Category API Error:", kpiCategoryError);
  }

  /* =====================================================
     Render
  ===================================================== */

  return (
    <>
      {/* =================================================
          Dashboard Filters
      ================================================= */}

      {/* <DashboardFilters
        yearOptions={yearOptions}
        indicatorTypeOptions={
          indicatorTypeOptions
        }
        departmentOptions={
          departmentOptions
        }
        branchOptions={branchOptions}
        onSearch={handleFilterSearch}
      /> */}
      <DashboardFilters
        yearOptions={yearOptions}
        indicatorTypeOptions={indicatorTypeOptions}
        departmentOptions={departmentOptions}
        branchOptions={branchOptions}
        onSearch={handleFilterSearch}
      />

      <div className="rounded-xl bg-muted/30 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="font-medium text-foreground">ตัวกรองที่เลือก</span>

          <span className="text-muted-foreground">
            ปี:
            <span className="ml-1 font-medium text-foreground">
              {selectedFilterText.yearLabel}
            </span>
          </span>

          <span className="text-muted-foreground">
            ประเภทตัวชี้วัด:
            <span className="ml-1 font-medium text-foreground">
              {selectedFilterText.indicatorLabel}
            </span>
          </span>

          <span className="text-muted-foreground">
            หน่วยงาน:
            <span className="ml-1 font-medium text-foreground">
              {selectedFilterText.departmentLabel}
            </span>
          </span>
        </div>
      </div>
      {/* =================================================
          Summary + Pie
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <KpiSummaryCards summary={kpiSummary} />

        <PerformancePieChart data={pieData} />
      </div>

      {/* =================================================
          Indicator Table
      ================================================= */}

      <IndicatorTable data={indicators} />

      {/* =================================================
          Analysis Chart
      ================================================= */}
    <ComparisonDashboard />

      <IndicatorAnalysisChart
        // data={analysisData}
        // yearOptions={yearOptions}
        // indicatorTypeOptions={indicatorTypeOptions}
        // indicatorOptions={analysisIndicatorOptions}
      />

  
    </>
  );
}
