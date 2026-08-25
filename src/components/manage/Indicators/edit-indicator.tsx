"use client";

import { useGetKpi } from "@/service/kpi/kpi";
import { IndicatorForm } from "./indicator-form";
import { indicatorToFormValues } from "@/lib/indicator-mapper";

interface EditIndicatorProps {
  id: string;
}

export function EditIndicator({ id }: EditIndicatorProps) {
  const {
    data: kpiResponse,
    isLoading,
    error: isError,
  } = useGetKpi();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[20px] border border-destructive/30 p-6">
        <p className="text-destructive">ไม่สามารถโหลดข้อมูลตัวชี้วัดได้</p>
      </div>
    );
  }

  const indicators = Array.isArray(kpiResponse?.data) ? kpiResponse.data : [];

  const indicator = indicators.find(
    (item: any) => String(item.id) === String(id)
  );

  if (!indicator) {
    return (
      <div className="rounded-[20px] border p-6">
        <p>ไม่พบตัวชี้วัด ID: {id}</p>
      </div>
    );
  }

  return (
    <IndicatorForm
      mode="edit"
      id={id}                                      // ✅ ส่ง id สำหรับ update
      title="แก้ไขตัวชี้วัด"
      initialValues={indicatorToFormValues(indicator)}
    />
  );
}
