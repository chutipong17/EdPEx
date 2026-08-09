"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";

import type { IndicatorType } from "@/types/indicator-type";
import type { IndicatorTypeFormValues } from "@/lib/indicator-type-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteKpiCategory } from "@/service/kpi-category/kpi-category";

interface DeleteIndicatorTypeDialogProps {
  indicatorType: IndicatorType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteIndicatorTypeDialog({
  indicatorType,
  open,
  onOpenChange,
  onDeleted,
}: DeleteIndicatorTypeDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const { mutateAsync: deleteKpiCategory } = useDeleteKpiCategory();

  async function handleDelete() {
    if (!indicatorType) return;
    setSubmitting(true);

    try {
      await toast.promise(
        deleteKpiCategory({
          id: indicatorType.id,
        }),
        {
          loading: "กำลังลบ...",
          success: "ลบประเภทตัวชี้วัดเรียบร้อยแล้ว",
          error: "ลบประเภทตัวชี้วัดไม่สำเร็จ",
        },
      );

      setTimeout(() => {
        onOpenChange(false);
        onDeleted();
      }, 300);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ลบประเภทตัวชี้วัดไม่สำเร็จ",
      );
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ยืนยันการลบ</DialogTitle>
          <DialogDescription>
            คุณต้องการลบประเภทตัวชี้วัดนี้หรือไม่
            {indicatorType ? ` "${indicatorType.categoryName}"` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 -mb-4 mt-2 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              />
            }
          >
            ยกเลิก
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={submitting}
            onClick={handleDelete}
            className="w-full gap-2 sm:w-auto"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            ลบข้อมูล
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
