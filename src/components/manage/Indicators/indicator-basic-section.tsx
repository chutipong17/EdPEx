"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSection } from "./form-section";
import { RequiredMark } from "./required-mark";
import { DATA_YEARS, INDICATOR_TYPES } from "@/types/indicator-Edpx";
import type { IndicatorFormValues } from "@/lib/indicator-schema";
import { mockIndicatorTypes } from "@/lib/mock-indicator-types";
export function IndicatorBasicSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<IndicatorFormValues>();

  return (
    <FormSection
      step={1}
      title="ข้อมูลพื้นฐาน"
      description="ข้อมูลทั่วไปของตัวชี้วัด"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
    >
      <Controller
        control={control}
        name="year"
        render={({ field }) => (
          <Field data-invalid={!!errors.year}>
            <FieldLabel htmlFor="year">
              ปีข้อมูล <RequiredMark />
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="year"
                className="h-10 w-full"
                aria-invalid={!!errors.year}
              >
                <SelectValue placeholder="เลือกปีข้อมูล" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {DATA_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.year]} />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="indicatorType"
        render={({ field }) => (
          <Field data-invalid={!!errors.indicatorType}>
            <FieldLabel htmlFor="indicatorType">
              ประเภทตัวชี้วัด <RequiredMark />
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="indicatorType"
                className="h-10 w-full"
                aria-invalid={!!errors.indicatorType}
              >
                <SelectValue placeholder="เลือกประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {mockIndicatorTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.indicatorType]} />
          </Field>
        )}
      />

      <Field data-invalid={!!errors.code}>
        <FieldLabel htmlFor="code">
          รหัสตัวชี้วัด <RequiredMark />
        </FieldLabel>
        <Input
          id="code"
          className="h-10"
          placeholder="เช่น KPI-1.1"
          aria-invalid={!!errors.code}
          {...register("code")}
        />
        <FieldError errors={[errors.code]} />
      </Field>

      <Field
        data-invalid={!!errors.name}
        className="md:col-span-2 xl:col-span-4"
      >
        <FieldLabel htmlFor="name">
          ชื่อตัวชี้วัด <RequiredMark />
        </FieldLabel>
        <Input
          id="name"
          className="h-10"
          placeholder="กรอกชื่อตัวชี้วัด"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>
    </FormSection>
  );
}
