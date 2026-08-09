"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { IndicatorType } from "@/types/indicator-type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { IndicatorTypeFormValues } from "@/lib/indicator-type-schema";
import { IndicatorTypeForm } from "./indicator-type-form";
import { useUpdateKpiCategory } from "@/service/kpi-category/kpi-category";

interface EditIndicatorTypeDialogProps {
  indicatorType: IndicatorType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditIndicatorTypeDialog({
  indicatorType,
  open,
  onOpenChange,
  onUpdated,
}: EditIndicatorTypeDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  
const { mutateAsync: updateKpiCategory } = useUpdateKpiCategory();
  async function handleSubmit(values: IndicatorTypeFormValues) {
    if (!indicatorType) return;

    setSubmitting(true);
    try {
      
       const res = await updateKpiCategory({
      id: indicatorType.id,
      body: {
        categoryName: values.categoryName,
      },
    });

    toast.success("แก้ไขประเภทตัวชี้วัดเรียบร้อย");
    onOpenChange(false);
    onUpdated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถบันทึกข้อมูลได้",
      );
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>แก้ไขประเภทตัวชี้วัด</DialogTitle>
          <DialogDescription>
            แก้ไขประเภทตัวชี้วัดแล้วกดบันทึกข้อมูลเพื่อยืนยัน
          </DialogDescription>
        </DialogHeader>
        {open && indicatorType && (
          <IndicatorTypeForm
            defaultName={indicatorType.categoryName}
            submitting={submitting}
            onSubmit={handleSubmit}
          ></IndicatorTypeForm>
        )}
      </DialogContent>
    </Dialog>
  );
}
