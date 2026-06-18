"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
import { COLLECTION_PERIODS, TARGET_CONDITIONS } from "@/types/indicator-Edpx"
import type { IndicatorFormValues } from "@/lib/indicator-schema"

export function IndicatorTargetSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<IndicatorFormValues>()

  return (
    <FormSection
      step={2}
      title="ข้อมูลเป้าหมาย"
      description="กำหนดค่าเป้าหมายและการเก็บข้อมูล"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
    >
      <Controller
        control={control}
        name="targetCondition"
        render={({ field }) => (
          <Field data-invalid={!!errors.targetCondition}>
            <FieldLabel htmlFor="targetCondition">
              เงื่อนไขเป้าหมาย <RequiredMark />
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="targetCondition"
                className="h-10 w-full"
                aria-invalid={!!errors.targetCondition}
              >
                <SelectValue placeholder="เลือกเงื่อนไข" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TARGET_CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.targetCondition]} />
          </Field>
        )}
      />

      <Field data-invalid={!!errors.target}>
        <FieldLabel htmlFor="target">
          เป้าหมาย <RequiredMark />
        </FieldLabel>
        <Input
          id="target"
          type="number"
          step="any"
          className="h-10"
          placeholder="0"
          aria-invalid={!!errors.target}
          {...register("target")}
        />
        <FieldError errors={[errors.target]} />
      </Field>

      <Field data-invalid={!!errors.unit}>
        <FieldLabel htmlFor="unit">
          หน่วยนับ <RequiredMark />
        </FieldLabel>
        <Input
          id="unit"
          className="h-10"
          placeholder="เช่น ร้อยละ, เรื่อง, คะแนน"
          aria-invalid={!!errors.unit}
          {...register("unit")}
        />
        <FieldError errors={[errors.unit]} />
      </Field>

      <Controller
        control={control}
        name="collectionPeriod"
        render={({ field }) => (
          <Field data-invalid={!!errors.collectionPeriod}>
            <FieldLabel htmlFor="collectionPeriod">
              ระยะเวลาการเก็บข้อมูล <RequiredMark />
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="collectionPeriod"
                className="h-10 w-full"
                aria-invalid={!!errors.collectionPeriod}
              >
                <SelectValue placeholder="เลือกระยะเวลา" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {COLLECTION_PERIODS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.collectionPeriod]} />
          </Field>
        )}
      />
    </FormSection>
  )
}
