import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STATUS_LABELS, type IndicatorStatus } from '@/types/indicators'

const CONFIG: Record<
  IndicatorStatus,
  { icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  completed: { icon: CheckCircle2, className: 'text-success' },
  pending: { icon: Clock, className: 'text-warning' },
  rejected: { icon: XCircle, className: 'text-danger' },
}

export function StatusBadge({ status }: { status: IndicatorStatus }) {
  const { icon: Icon, className } = CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', className)}>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
