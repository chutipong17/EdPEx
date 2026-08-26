"use client"

import { Controller, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldError } from "@/components/ui/field"
import { FormSection } from "./form-section"
import { MONTHS } from "@/types/indicator-Edpx"
import type { IndicatorFormValues } from "@/lib/indicator-schema"
import { useGetMonth } from "@/service/month/month"

export function IndicatorMonthSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<IndicatorFormValues>()
 const {
  data: monthResponse,
  isLoading: monthLoading,
  error: monthError,
} = useGetMonth();

return (
  <FormSection
    step={3}
    title="การส่งมอบ"
    description="เลือกเดือนที่ต้องส่งมอบข้อมูล (เลือกได้แค่ 1 เดือน)"
  >
    <Controller
      control={control}
      name="months"
      render={({ field }) => {
        const selected: string[] = Array.isArray(field.value)
          ? field.value.filter(
              (value): value is string => typeof value === "string"
            )
          : [];

        const toggle = (monthId: string) => {
          if (selected.includes(monthId)) {
            field.onChange([]);
          } else {
            // เลือกได้แค่ 1 เดือน
            field.onChange([monthId]);
          }
        };

        return (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {monthLoading ? (
                <div className="col-span-full text-sm text-muted-foreground">
                  กำลังโหลดข้อมูลเดือน...
                </div>
              ) : (
                (monthResponse.data).map((month: any) => {
                  const monthId = String(month.id);
                  const checked = selected.includes(monthId);

                  return (
                    <label
                      key={month.id}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-3 rounded-[10px] border px-3 py-2.5 text-sm transition-colors",
                        "focus-within:ring-2 focus-within:ring-ring",
                        checked
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card hover:bg-muted"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggle(monthId)}
                      />

                      <span className="font-medium">
                        {month.name}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            <FieldError errors={[errors.months]} />
          </div>
        );
      }}
    />
  </FormSection>
);
}