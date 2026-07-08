"use client"

import { useMemo, useState , useEffect} from "react"
import { FilterPanel } from "./filter-panel"
import { ChartGrid } from "@/components/results/chart-grid"
import { PaginationSection } from "@/components/results/pagination-section"
import { indicatorsGraph as allIndicators } from "@/lib/mock-data"
import type { FilterState } from "@/types/indicator-graph"

const PAGE_SIZE = 6

const DEFAULT_FILTERS: FilterState = {
  year: "all",
  category: "all",
  chartType: "composed",
  search: "",
}

export function  ResultsDashboard() {


  const [draft, setDraft] = useState<FilterState>(DEFAULT_FILTERS)
  const [applied, setApplied] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  

  const filtered = useMemo(() => {
  return allIndicators.filter((ind) => {
    if (applied.category !== "all" && ind.category !== applied.category) {
      return false
    }

    const search = (applied.search ?? "").trim().toLowerCase()

    if (search) {
      if (
        !ind.code.toLowerCase().includes(search) &&
        !ind.description.toLowerCase().includes(search)
      ) {
        return false
      }
    }

    return true
  })
}, [applied])

  // Year filter narrows the data points within each indicator.
  const visibleIndicators = useMemo(() => {
    if (applied.year === "all") return filtered
    return filtered.map((ind) => ({
      ...ind,
      data: ind.data.filter((d) => d.year === applied.year),
    }))
  }, [filtered, applied.year])

  const totalPages = Math.max(1, Math.ceil(visibleIndicators.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = visibleIndicators.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  function handleSearch() {
    setApplied(draft)
    setPage(1)
  }

  function handleReset() {
    setDraft(DEFAULT_FILTERS)
    setApplied(DEFAULT_FILTERS)
    setPage(1)
  }
 

 

  return (
  <main className="flex-1 p-6">
          <h1 className="mb-6 text-3xl font-semibold text-balance text-title">
            กราฟผลลัพธ์
          </h1>

          <div className="flex flex-col gap-6">
            <FilterPanel
              filters={draft}
              onChange={(next) => setDraft((f) => ({ ...f, ...next }))}
              onSearch={handleSearch}
              onReset={handleReset}
            />

            <section className="min-h-[700px] rounded-3xl bg-card p-6 shadow-sm">
              <ChartGrid
                indicators={paged}
                chartType={applied.chartType ?? "all"}
              />

              <PaginationSection
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </section>
          </div>
        </main>
  )
}
