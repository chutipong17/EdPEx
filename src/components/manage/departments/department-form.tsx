'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'

import {
  departmentSchema,
  type DepartmentFormValues,
} from '@/lib/department-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogClose } from '@/components/ui/dialog'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'

interface DepartmentFormProps {
  defaultName?: string
  submitting?: boolean
  onSubmit: (values: DepartmentFormValues) => void
}

export function DepartmentForm({
  defaultName = '',
  submitting = false,
  onSubmit,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { departmentName: defaultName },
    mode: 'onSubmit',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="px-1 py-2">
        <Field data-invalid={!!errors.departmentName || undefined}>
          <FieldLabel htmlFor="department-name">
            ชื่อหน่วยงาน <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="department-name"
            placeholder="กรอกชื่อหน่วยงาน"
            autoComplete="off"
            aria-invalid={!!errors.departmentName || undefined}
            {...register('departmentName')}
          />
          <FieldError errors={errors.departmentName ? [errors.departmentName] : undefined} />
        </Field>
      </FieldGroup>

      <div className="-mx-4 -mb-4 mt-2 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end">
        <DialogClose
          render={
            <Button type="button" variant="outline" className="w-full sm:w-auto" />
          }
        >
          ย้อนกลับ
        </DialogClose>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full gap-2 sm:w-auto"
        >
          <Save className="size-4" aria-hidden="true" />
          บันทึกข้อมูล
        </Button>
      </div>
    </form>
  )
}
