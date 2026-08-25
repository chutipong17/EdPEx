'use client'

import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FilterOption } from '@/types/dashboard'
import { Search, RotateCcw } from 'lucide-react'

const schema = z.object({
  year: z.string(),
  indicatorType: z.string(),
  department: z.string(),
  branch: z.string(),
})

type FilterValues = z.infer<typeof schema>

const defaults: FilterValues = {
  year: 'all',
  indicatorType: 'all',
  department: 'all',
  branch: 'all',
}

interface FieldProps {
  name: keyof FilterValues
  label: string
  options: FilterOption[]
  control: ReturnType<typeof useForm<FilterValues>>['control']
}

function SelectField({ name, label, options, control }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-md">
      <Label htmlFor={name} className="text-xs text-muted-foreground width">
        {label}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={(v) => field.onChange(v ?? 'all')}>
            <SelectTrigger id={name} className="h-10 rounded-lg w-full" aria-label={label}>
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  )
}

interface DashboardFiltersProps {
  yearOptions: FilterOption[]
  indicatorTypeOptions: FilterOption[]
  departmentOptions: FilterOption[]
  branchOptions: FilterOption[]
  onSearch?: (values: FilterValues) => void
}

export function DashboardFilters({
  yearOptions,
  indicatorTypeOptions,
  departmentOptions,
  branchOptions,
  onSearch,
}: DashboardFiltersProps) {
  const { control, handleSubmit, reset } = useForm<FilterValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as Resolver<FilterValues>,
    defaultValues: defaults,
  })

  return (
    <form
      onSubmit={handleSubmit((v) => onSearch?.(v))}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SelectField name="year" label="ปี" options={yearOptions} control={control} />
        <SelectField
          name="indicatorType"
          label="ประเภทตัวชี้วัด"
          options={indicatorTypeOptions}
          control={control}
        />
        <SelectField
          name="department"
          label="หน่วยงาน"
          options={departmentOptions}
          control={control}
        />
        {/* <SelectField name="branch" label="สาขา" options={branchOptions} control={control} /> */}

        <div className="flex items-end">
          <Button type="submit" className="h-10 w-full rounded-xl">
            <Search className="size-4" aria-hidden="true" />
            ค้นหา
          </Button>
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full rounded-xl"
            onClick={() => reset(defaults)}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            รีเซ็ต
          </Button>
        </div>
      </div>
    </form>
  )
}
