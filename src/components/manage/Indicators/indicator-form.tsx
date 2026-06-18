"use client"

import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { IndicatorBasicSection } from "./indicator-basic-section"
import { IndicatorTargetSection } from "./indicator-target-section"
import { IndicatorMonthSection } from "./indicator-month-section"
import { IndicatorOwnerSection } from "./indicator-owner-section"
import { IndicatorCollectorSection } from "./indicator-collector-section"
import {
  indicatorFormSchema,
  defaultFormValues,
  type IndicatorFormValues,
} from "@/lib/indicator-schema"

interface IndicatorFormProps {
  mode: "create" | "edit"
  initialValues?: Partial<IndicatorFormValues>
  title: string
}

export function IndicatorForm({ mode, initialValues, title }: IndicatorFormProps) {
  const router = useRouter()

  const methods = useForm<IndicatorFormValues>({
    resolver: zodResolver(indicatorFormSchema),
    defaultValues: { ...defaultFormValues, ...initialValues },
    mode: "onBlur",
  })

  function onSubmit(values: IndicatorFormValues) {
    console.log("[v0] Indicator form submitted:", values)
    toast.success(
      mode === "create" ? "บันทึกตัวชี้วัดใหม่เรียบร้อยแล้ว" : "แก้ไขตัวชี้วัดเรียบร้อยแล้ว",
    )
    router.push("/admin/indicators")
  }

  function onError() {
    toast.error("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง")
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
          >
            <ArrowLeft data-icon="inline-start" />
            ย้อนกลับ
          </Button>
          <Button type="submit" className="h-11 w-full sm:w-auto">
            <Save data-icon="inline-start" />
            บันทึกข้อมูล
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
