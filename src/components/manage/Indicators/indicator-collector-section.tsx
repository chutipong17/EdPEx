"use client"

import { useFormContext } from "react-hook-form"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormSection } from "./form-section"
import type { IndicatorFormValues } from "@/lib/indicator-schema"

export function IndicatorCollectorSection() {
  const { register } = useFormContext<IndicatorFormValues>()

  return (
    <FormSection
      step={5}
      title="กำหนดคู่เทียบ"
      description="ระบุชื่อคู่เทียบข้อมูลและผลลัพธ์ (สูงสุด 6 รายการ)"
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[10px] border border-border bg-background p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <h3 className="text-sm font-medium text-foreground">
              คู่เทียบข้อมูลรายการที่ {index + 1}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`collector-name-${index}`}>
                ชื่อคู่เทียบ {index + 1}
              </FieldLabel>
              <Input
                id={`collector-name-${index}`}
                className="h-10"
                placeholder="กรอกชื่อคู่เทียบ"
                {...register(`collectors.${index}.name` as const)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`collector-result-${index}`}>
                ผลลัพธ์คู่เทียบ {index + 1}
              </FieldLabel>
              <Input
                id={`collector-result-${index}`}
                className="h-10"
                placeholder="กรอกผลลัพธ์"
                {...register(`collectors.${index}.result` as const)}
              />
            </Field>
          </div>
        </div>
      ))}
    </FormSection>
  )
}
