interface DashboardErrorProps {
  type?: "kpi" | "dashboard";
}

export function DashboardLoading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-sm text-muted-foreground">
        กำลังโหลดข้อมูล...
      </p>
    </div>
  );
}

export function DashboardError({
  type = "kpi",
}: DashboardErrorProps) {
  const message =
    type === "kpi"
      ? "ไม่สามารถโหลดข้อมูล KPI ได้"
      : "ไม่สามารถโหลดข้อมูล Dashboard ได้";

  return (
    <div className="rounded-xl border border-danger/20 bg-danger/5 p-6">
      <p className="text-sm text-danger">
        {message}
      </p>
    </div>
  );
}