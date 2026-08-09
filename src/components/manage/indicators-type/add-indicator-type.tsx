"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import type { IndicatorTypeFormValues } from "@/lib/indicator-type-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IndicatorTypeForm } from "./indicator-type-form";
import { useCreateKpiCategory} from "@/service/kpi-category/kpi-category";

interface AddIndicatorTypeDialogProps {
  onCreated: () => void;
}
export function AddIndicatorTypeDialog({
  onCreated,
}: AddIndicatorTypeDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { mutateAsync: createKpiCategory, isPending } = useCreateKpiCategory();

  async function handleSubmit(values: IndicatorTypeFormValues) {

    setSubmitting(true);
 
    try {
     
  
     
     const res =  await createKpiCategory({
        body: values,
      });
      toast.success("เพิ่มประเภทตัวชี้วัดเรียบร้อย");
      setOpen(false);
      onCreated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถบันทึกข้อมูลได้",
      );
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="gap-2 border-info/40 text-info hover:bg-info/10 hover:text-info"
          />
        }
      >
        <PlusCircle className="size-4" aria-hidden="true" />
        เพิ่มประเภทตัวชี้วัด
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>เพิ่มตัวชี้วัด</DialogTitle>
          <DialogDescription>
            กรอกประเภทตัวชี้วัดที่ต้องการเพิ่มเข้าสู่ระบบ
          </DialogDescription>
        </DialogHeader>
        {open && (
          <IndicatorTypeForm submitting={submitting} onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}
