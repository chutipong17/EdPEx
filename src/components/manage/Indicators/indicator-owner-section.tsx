"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormSection } from "./form-section"
import { RequiredMark } from "./required-mark"
import { departments } from "@/lib/mock-departments"
import { users } from "@/lib/mock-user-indicator"
import type { IndicatorFormValues } from "@/lib/indicator-schema"

export function IndicatorOwnerSection() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IndicatorFormValues>()

  const selectedDept = watch("department")
  const deptId = departments.find((d) => d.name === selectedDept)?.id
  const availableUsers = deptId
    ? users.filter((u) => u.departmentId === deptId)
    : users

  return (
    <FormSection
      step={4}
      title="กำหนดผู้รับผิดชอบ"
      description="ระบุหน่วยงานและผู้รับผิดชอบตัวชี้วัด"
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <Controller
        control={control}
        name="department"
        render={({ field }) => (
          <Field data-invalid={!!errors.department}>
            <FieldLabel htmlFor="department">
              หน่วยงานผู้รับผิดชอบ <RequiredMark />
            </FieldLabel>
            <Select
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v)
                setValue("owner", "")
              }}
            >
              <SelectTrigger
                id="department"
                className="h-10 w-full"
                aria-invalid={!!errors.department}
              >
                <SelectValue placeholder="เลือกหน่วยงาน" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.department]} />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="owner"
        render={({ field }) => (
          <Field data-invalid={!!errors.owner}>
            <FieldLabel htmlFor="owner">
              ผู้รับผิดชอบ <RequiredMark />
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="owner"
                className="h-10 w-full"
                aria-invalid={!!errors.owner}
              >
                <SelectValue placeholder="เลือกผู้รับผิดชอบ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableUsers.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.owner]} />
          </Field>
        )}
      />
    </FormSection>
  )
}
