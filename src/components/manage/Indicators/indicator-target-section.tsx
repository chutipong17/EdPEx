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
import { COLLECTION_PERIODS, TARGET_CONDITIONS } from "@/types/indicator-Edpx";
import type { IndicatorFormValues } from "@/lib/indicator-schema";
import { useGetTargetCondition } from "@/service/target-condition/target-condition";
import { useGetFrequency } from "@/service/requency/frequency";
export function IndicatorTargetSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<IndicatorFormValues>();

  const { data: targetCondition, isLoading, error } = useGetTargetCondition();
  console.log("targetCondition ==", targetCondition);

  const {
    data: frequency,
    isLoading: frequencyLoading,
    error: frequencyError,
  } = useGetFrequency();

  console.log("frequency ===", frequency);

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
        render={({ field }) => {
          const selectedCondition = targetCondition?.data?.find(
            (item: any) => String(item.id) === String(field.value),
          );

          return (
            <Field data-invalid={!!errors.targetCondition}>
              <FieldLabel htmlFor="targetCondition">
                เงื่อนไขเป้าหมาย <RequiredMark />
              </FieldLabel>

              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="targetCondition"
                  className="h-10 w-full"
                  aria-invalid={!!errors.targetCondition}
                >
                  <SelectValue placeholder="เลือกเงื่อนไข">
                    {selectedCondition?.description ?? "เลือกเงื่อนไข"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {targetCondition?.data?.map((item: any) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.description}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {errors.targetCondition && (
                <p className="text-sm text-red-500">
                  {errors.targetCondition.message as string}
                </p>
              )}
            </Field>
          );
        }}
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
        render={({ field }) => {
          const selectedFrequency = (frequency?.data ?? []).find(
            (p: any) => String(p.id) === String(field.value),
          );

          return (
            <Field data-invalid={!!errors.collectionPeriod}>
              <FieldLabel htmlFor="collectionPeriod">
                ระยะเวลาการเก็บข้อมูล <RequiredMark />
              </FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <SelectTrigger
                  id="collectionPeriod"
                  className="h-10 w-full"
                  aria-invalid={!!errors.collectionPeriod}
                >
                  <SelectValue placeholder="เลือกระยะเวลา">
                    {selectedFrequency
                      ? selectedFrequency.frequencyName
                      : "เลือกระยะเวลา"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {(frequency?.data ?? []).map((p: any) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.frequencyName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FieldError errors={[errors.collectionPeriod]} />
            </Field>
          );
        }}
      />

      {/* <Controller
        control={control}
        name="collectionPeriod"
        render={({ field }) => (
          <Field data-invalid={!!errors.collectionPeriod}>
            <FieldLabel htmlFor="collectionPeriod">
              ระยะเวลาการเก็บข้อมูล <RequiredMark />
            </FieldLabel>

            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger
                id="collectionPeriod"
                className="h-10 w-full"
                aria-invalid={!!errors.collectionPeriod}
              >
                <SelectValue placeholder="เลือกระยะเวลา" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {(frequency?.data ?? []).map((p: any) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.frequencyName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <FieldError errors={[errors.collectionPeriod]} />
          </Field>
        )}
      /> */}
    </FormSection>
  );
}
