"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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

  async function handleDelete() {
    if (!indicatorType) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/my-indicator-types/${indicatorType.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "ไม่สามารถลบข้อมูลได้");
      }
      toast.success("ลบประเภทตัวชี้วัดเรียบร้อยแล้ว");
      onOpenChange(false);
      onDeleted();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถบลข้อมูลได้",
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
            {indicatorType ? ` "${indicatorType.name}"` : ''}
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
