import type { CSSProperties } from "react";

interface DashboardErrorProps {
  type?: "kpi" | "dashboard";
}

/* =====================================================
   Skeleton Base
===================================================== */
function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-muted ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-background/60 to-transparent" />
    </div>
  );
}

/* =====================================================
   Dashboard Loading
===================================================== */

export function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* =================================================
          Filters
      ================================================= */}
      <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>

          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </section>

      {/* =================================================
          Selected Filters
      ================================================= */}
      <section className="rounded-xl border border-border bg-muted/30 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-36" />
        </div>
      </section>

      {/* =================================================
          KPI + Performance
      ================================================= */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        {/* KPI Summary */}
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>

                <Skeleton className="h-11 w-11 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Performance Pie */}
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-72" />
          </div>

          <div className="flex min-h-[300px] items-center justify-center">
            <div className="relative">
              <Skeleton className="h-56 w-56 rounded-full" />

              <div className="absolute inset-8 rounded-full bg-background" />
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          Indicator Table
      ================================================= */}
      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-3 w-72" />
          </div>

          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 bg-muted/50 px-5 py-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center gap-4 border-t border-border px-5 py-4"
            >
              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-4 w-44" />

              <Skeleton className="h-4 w-28" />

              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          Analysis Chart
      ================================================= */}
      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-3 w-80" />
          </div>

          <Skeleton className="h-10 w-44 rounded-lg" />
        </div>

        {/* Chart Area */}
        <div className="relative h-[320px]">
          {/* Horizontal Grid */}
          <div className="absolute inset-x-0 top-0 border-t border-border/60" />
          <div className="absolute inset-x-0 top-1/4 border-t border-border/60" />
          <div className="absolute inset-x-0 top-2/4 border-t border-border/60" />
          <div className="absolute inset-x-0 top-3/4 border-t border-border/60" />
          <div className="absolute inset-x-0 bottom-0 border-t border-border/60" />

          {/* Bars */}
          <div className="absolute inset-0 flex items-end gap-5 px-6 pb-8 pt-4">
            {[42, 68, 52, 82, 61, 74, 48, 88].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 items-end"
                >
                  <Skeleton
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          Loading Status
      ================================================= */}
      <div className="flex items-center justify-center gap-3 py-1">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
        </div>

        <span className="text-xs text-muted-foreground">
          กำลังโหลดข้อมูล Dashboard
        </span>
      </div>
    </div>
  );
}

/* =====================================================
   Dashboard Error
===================================================== */

export function DashboardError({
  type = "kpi",
}: DashboardErrorProps) {
  const message =
    type === "kpi"
      ? "ไม่สามารถโหลดข้อมูล KPI ได้"
      : "ไม่สามารถโหลดข้อมูล Dashboard ได้";

  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-danger/20 bg-danger/5 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6 text-danger"
          >
            <circle cx="12" cy="12" r="9" />

            <path
              d="M12 8v4"
              strokeLinecap="round"
            />

            <path
              d="M12 16h.01"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="mt-4 text-sm font-semibold text-danger">
          {message}
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง
        </p>
      </div>
    </div>
  );
}