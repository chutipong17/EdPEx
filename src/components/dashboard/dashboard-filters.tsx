"use client";

import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FilterOption } from "@/types/dashboard";

import { Search, RotateCcw } from "lucide-react";

/* =====================================================
   Schema
===================================================== */

const schema = z.object({
  year: z.string(),
  indicatorType: z.string(),
  department: z.string(),
  branch: z.string(),
});

type FilterValues = z.infer<typeof schema>;

/* =====================================================
   Dashboard Filter Payload
===================================================== */

export interface DashboardFilterPayload {
  year: number | null;
  indicatorType: number | null;
  departmentName: number | null;
}

/* =====================================================
   Default Values
===================================================== */

const defaults: FilterValues = {
  year: "ปีปัจจุบัน",
  indicatorType: "all",
  department: "all",
  branch: "all",
};

/* =====================================================
   Field Props
===================================================== */

interface FieldProps {
  name: keyof FilterValues;
  label: string;
  options: FilterOption[];
  control: ReturnType<typeof useForm<FilterValues>>["control"];
}

/* =====================================================
   Select Field
===================================================== */

function SelectField({
  name,
  label,
  options,
  control,
}: FieldProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-1.5">
      <Label
        htmlFor={name}
        className="text-xs text-muted-foreground"
      >
        {label}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          // หา option จาก value ที่ถูกเลือก
          const selectedOption = options.find(
            (option) => option.value === field.value,
          );

          return (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger
                id={name}
                className="h-10 w-full rounded-lg"
                aria-label={label}
              >
                <SelectValue placeholder={label}>
                  {selectedOption?.label ?? label}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
    </div>
  );
}

/* =====================================================
   Props
===================================================== */

interface DashboardFiltersProps {
  yearOptions: FilterOption[];
  indicatorTypeOptions: FilterOption[];
  departmentOptions: FilterOption[];
  branchOptions: FilterOption[];

  onSearch?: (values: DashboardFilterPayload) => void;
}

/* =====================================================
   Component
===================================================== */

export function DashboardFilters({
  yearOptions,
  indicatorTypeOptions,
  departmentOptions,
  branchOptions,
  onSearch,
}: DashboardFiltersProps) {
  const { control, handleSubmit, reset } = useForm<FilterValues>({
    resolver: zodResolver(schema) as Resolver<FilterValues>,
    defaultValues: defaults,
  });

  /* =====================================================
     Search
  ===================================================== */

  const handleSearch = (values: FilterValues) => {
    const payload: DashboardFilterPayload = {
      year: values.year === "all" ? null : Number(values.year),

      indicatorType:
        values.indicatorType === "all" ? null : Number(values.indicatorType),

      departmentName:
        values.department === "all" ? null : Number(values.department),
    };

    console.log("Dashboard Filter Payload:", payload);

    onSearch?.(payload);
  };

  /* =====================================================
     Reset
  ===================================================== */

  const handleReset = () => {
    reset(defaults);

    const payload: DashboardFilterPayload = {
      year: null,
      indicatorType: null,
      departmentName: null,
    };

    console.log("Dashboard Reset Payload:", payload);

    onSearch?.(payload);
  };

  /* =====================================================
     Render
  ===================================================== */

  return (
    <form
      onSubmit={handleSubmit(handleSearch)}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* =================================================
            Year
        ================================================= */}

        <SelectField
          name="year"
          label="ปีปัจจุบัน"
          options={yearOptions}
          control={control}
        />

        {/* =================================================
            Indicator Type
        ================================================= */}

        <SelectField
          name="indicatorType"
          label="ประเภทตัวชี้วัด"
          options={indicatorTypeOptions}
          control={control}
        />

        {/* =================================================
            Department
        ================================================= */}

        <SelectField
          name="department"
          label="หน่วยงาน"
          options={departmentOptions}
          control={control}
        />

        {/* =================================================
            Branch
            ยังไม่เปิดใช้งาน
        ================================================= */}

        {/*
        <SelectField
          name="branch"
          label="สาขา"
          options={branchOptions}
          control={control}
        />
        */}

        {/* =================================================
            Search Button
        ================================================= */}

        <div className="flex items-end">
          <Button type="submit" className="h-10 w-full rounded-xl">
            <Search className="size-4" aria-hidden="true" />
            ค้นหา
          </Button>
        </div>

        {/* =================================================
            Reset Button
        ================================================= */}

        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full rounded-xl"
            onClick={handleReset}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            รีเซ็ต
          </Button>
        </div>
      </div>
    </form>
  );
}
