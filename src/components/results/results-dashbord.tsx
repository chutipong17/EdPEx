"use client";

import { useMemo, useState } from "react";
import { FilterPanel } from "./filter-panel";
import { ChartGrid } from "@/components/results/chart-grid";
import { PaginationSection } from "@/components/results/pagination-section";
import type { FilterState } from "@/types/indicator-graph";
import type { KpiApi } from "@/types/kpi-kpi";
import { mapKpisToIndicatorGraphs } from "@/lib/kpi-to-chart";
import { useGetKpi } from "@/service/kpi/kpi";

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: FilterState = {
  year: String(new Date().getFullYear() + 543),
  category: "all",
  chartType: "composed",
  search: "",
};

export function ResultsDashboard() {
  const [draft, setDraft] = useState<FilterState>(DEFAULT_FILTERS);
  const [applied, setApplied] =
    useState<FilterState>(DEFAULT_FILTERS);

  const [page, setPage] = useState(1);

  const {
    data: kpiResponse,
    isLoading,
    error,
  } = useGetKpi();

  const kpis: KpiApi[] = useMemo(() => {
    if (Array.isArray(kpiResponse)) {
      return kpiResponse;
    }

    return kpiResponse?.data ?? [];
  }, [kpiResponse]);

  const allIndicators = useMemo(() => {
    return mapKpisToIndicatorGraphs(kpis);
  }, [kpis]);

  const filtered = useMemo(() => {
    return allIndicators.filter((ind) => {
      if (
        applied.category !== "all" &&
        ind.category !== applied.category
      ) {
        return false;
      }

      const search = (applied.search ?? "")
        .trim()
        .toLowerCase();

      if (search) {
        if (
          !ind.code.toLowerCase().includes(search) &&
          !ind.description.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allIndicators, applied]);

  const visibleIndicators = useMemo(() => {
    if (!applied.year) {
      return filtered;
    }

    return filtered
      .map((ind) => ({
        ...ind,
        data: ind.data.filter(
          (d) => d.year === applied.year,
        ),
      }))
      .filter((ind) => ind.data.length > 0);
  }, [filtered, applied.year]);

  const totalPages = Math.max(
    1,
    Math.ceil(visibleIndicators.length / PAGE_SIZE),
  );

  const safePage = Math.min(page, totalPages);

  const paged = visibleIndicators.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleSearch() {
    setApplied(draft);
    setPage(1);
  }

  function handleReset() {
    setDraft(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    setPage(1);
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-sm text-danger">
            ไม่สามารถโหลดข้อมูลตัวชี้วัดได้
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col gap-6">
        <FilterPanel
          filters={draft}
          onChange={(next) =>
            setDraft((f) => ({
              ...f,
              ...next,
            }))
          }
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <section className="min-h-[700px] rounded-3xl bg-card p-6 shadow-sm">
          <ChartGrid
            indicators={paged}
            chartType={applied.chartType ?? "composed"}
          />

          <PaginationSection
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      </div>
    </main>
  );
}