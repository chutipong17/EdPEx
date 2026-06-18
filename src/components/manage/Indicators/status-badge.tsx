import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import type { IndicatorStatus } from "@/types/indicator-Edpx"

const config: Record<
  IndicatorStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  success: {
    label: "บรรลุเป้าหมาย",
    icon: CheckCircle2,
    className: "bg-success/10 text-success ring-success/20",
  },
  warning: {
    label: "เฝ้าระวัง",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning ring-warning/20",
  },
  danger: {
    label: "ไม่บรรลุเป้าหมาย",
    icon: XCircle,
    className: "bg-danger/10 text-danger ring-danger/20",
  },
}

export function StatusBadge({ status }: { status: IndicatorStatus }) {
  const { label, icon: Icon, className } = config[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        className,
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  )
}
