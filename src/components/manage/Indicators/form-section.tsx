import { cn } from "@/lib/utils"

interface FormSectionProps {
  step: number
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({
  step,
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className="rounded-[20px] border border-border bg-card p-5 lg:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
          {step}
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className={cn(className)}>{children}</div>
    </section>
  )
}
