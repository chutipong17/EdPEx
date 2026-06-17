"use client"

import { useMemo, useState , useEffect} from "react"
import { Sidebar,SidebarMobileContent } from "@/components/layout/sidebar"
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Header } from "@/components/layout/header"
import { FilterPanel } from "./filter-panel"
import { ChartGrid } from "@/components/results/chart-grid"
import { PaginationSection } from "@/components/results/pagination-section"
import { indicatorsGraph as allIndicators } from "@/lib/mock-data"
import type { FilterState } from "@/types/indicator-graph"
import { cn } from "@/lib/utils"


const PAGE_SIZE = 6

const DEFAULT_FILTERS: FilterState = {
  year: "all",
  category: "all",
  chartType: "composed",
  search: "",
}

export function ResultsDashboard() {
  // Sidebar state: drawer on mobile, collapse toggle on desktop/tablet.
 const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [activeKey, setActiveKey] = useState('results')

  const [draft, setDraft] = useState<FilterState>(DEFAULT_FILTERS)
  const [applied, setApplied] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

    // Collapse sidebar automatically on laptop widths (1024px – 1279px)
    useEffect(() => {
      const mq = window.matchMedia('(min-width: 1024px) and (max-width: 1279px)')
      const apply = () => setCollapsed(mq.matches)
      apply()
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }, [])

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

  const handleNavigate = (key: string) => {
    setActiveKey(key)
    setMobileOpen(false)
  }

  function toggleSidebar() {
    // On large screens toggle collapse; on small screens open the drawer.
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setCollapsed((c) => !c)
    } else {
      setMobileOpen((o) => !o)
    }
  }

  return (
    <div className="min-h-screen bg-background">
     <Sidebar collapsed={collapsed} activeKey={activeKey} onNavigate={handleNavigate} />
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle className="sr-only">เมนูนำทาง</SheetTitle>
          <SidebarMobileContent activeKey={activeKey} onNavigate={handleNavigate} />
        </SheetContent>
      </Sheet>
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-[260px]",
        )}
      >
        <Header onToggleSidebar={toggleSidebar} />

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
      </div>
    </div>
  )
}
