import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  /** semantic tone controlling icon box colors */
  tone: 'primary' | 'success' | 'warning' | 'danger'
}

const toneStyles: Record<KpiCardProps['tone'], string> = {
  primary: 'bg-accent text-primary',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/12 text-danger',
}

export function KpiCard({ label, value, icon: Icon, tone }: KpiCardProps) {
  return (
    <div className="flex min-h-[72px] items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl',
          toneStyles[tone],
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xs text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold leading-tight text-foreground">{value}</span>
      </div>
    </div>
  )
}
