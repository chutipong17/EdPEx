"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { IndicatorBasicSection } from "./indicator-basic-section";
import { IndicatorTargetSection } from "./indicator-target-section";
import { IndicatorMonthSection } from "./indicator-month-section";
import { IndicatorOwnerSection } from "./indicator-owner-section";
import { IndicatorCollectorSection } from "./indicator-collector-section";
import { useCreateKpi, useUpdateKpi } from "@/service/kpi/kpi"; // ✅ import useUpdateKpi
import {
  indicatorFormSchema,
  defaultFormValues,
  type IndicatorFormValues,
} from "@/lib/indicator-schema";

interface IndicatorFormProps {
  mode: "create" | "edit";
  id?: string;                                    // ✅ เพิ่ม id (optional) สำหรับ edit
  initialValues?: Partial<IndicatorFormValues>;
  title:string
}

interface kpiComparisonData {
  seq: number;
  name: string;
  result: string;
  
}

export function IndicatorForm({ mode, id, initialValues, title }: IndicatorFormProps) {
  const router = useRouter();
  const { mutateAsync: createKpi, isPending: isCreating } = useCreateKpi();
  const { mutateAsync: updateKpi, isPending: isUpdating } = useUpdateKpi(); // ✅ hook สำหรับ edit

  const isPending = isCreating || isUpdating; // ✅ รวม loading state

  const methods = useForm<IndicatorFormValues>({
    resolver: zodResolver(indicatorFormSchema),
    defaultValues: { ...defaultFormValues, ...initialValues },
    mode: "onBlur",
  });

  async function onSubmit(values: IndicatorFormValues) {
    const kpiComparison: kpiComparisonData[] = values.collectors
      .filter((item) => item.name?.trim() || item.result?.trim())
      .map((item, index) => ({
        seq: index + 1,
        name: item.name?.trim() ?? "",
        result: item.result?.trim() ?? "",
      }));

    console.log("year ==", values);

    const payload = {
      kpiCategoryId: Number(values.indicatorType),
      departmentId: Number(values.department),
      monthOfDeliveryId: Number(values.months),
      frequencyId: Number(values.collectionPeriod),
      targetConditionId: Number(values.targetCondition),
      userId: Number(values.owner),
      kpiCode: values.code,
      kpiName: values.name,
      targetValue: Number(values.target),
      year: Number(values.year),
      unit: values.unit,
      kpiComparison,
    };

    console.log("Indicator form submitted: ", payload);

    try {
      if (mode === "create") {
        // ✅ Create mode
        await createKpi({ body: payload });
        toast.success("บันทึกตัวชี้วัดใหม่เรียบร้อยแล้ว");
      } else {
        // ✅ Edit mode — ส่ง id พร้อม payload
        await updateKpi({ id: Number(id!), body: payload });
        toast.success("แก้ไขตัวชี้วัดเรียบร้อยแล้ว");
      }

      router.push("/admin/manage/indicators");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        mode === "create"
          ? "ไม่สามารถบันทึกตัวชี้วัดได้ กรุณาลองใหม่อีกครั้ง"
          : "ไม่สามารถแก้ไขตัวชี้วัดได้ กรุณาลองใหม่อีกครั้ง"
      );
    }
  }

  function onError() {
    toast.error("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-5"
        noValidate
      >
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            กรอกข้อมูลตัวชี้วัดให้ครบถ้วน ช่องที่มีเครื่องหมาย{" "}
            <span className="text-danger">*</span> เป็นช่องที่จำเป็น
          </p>
        </div>

        <IndicatorBasicSection />
        <IndicatorTargetSection />
        <IndicatorMonthSection />
        <IndicatorOwnerSection />
        <IndicatorCollectorSection />

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full sm:w-auto"
            onClick={() => router.push("/admin/manage/indicators")}
            disabled={isPending} // ✅ disable ระหว่าง submit
          >
            <ArrowLeft data-icon="inline-start" />
            ย้อนกลับ
          </Button>
          <Button
            type="submit"
            className="h-11 w-full sm:w-auto"
            disabled={isPending} // ✅ disable ระหว่าง submit
          >
            <Save data-icon="inline-start" />
            {isPending ? "กำลังบันทึก..." : "บันทึกข้อมูล"} {/* ✅ แสดง loading text */}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
