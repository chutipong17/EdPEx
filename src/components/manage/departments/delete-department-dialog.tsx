'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import type { Department } from '@/types/department'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteDepartment } from '@/service/department/department'

interface DeleteDepartmentDialogProps {
  department: Department | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

export function DeleteDepartmentDialog({
  department,
  open,
  onOpenChange,
  onDeleted,
}: DeleteDepartmentDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const { mutateAsync: deleteDepartment } = useDeleteDepartment();

  async function handleDelete() {
    if (!department) return
    setSubmitting(true)
    try {
      await  deleteDepartment({
          id: department.id,
        })
      toast.success('ลบหน่วยงานเรียบร้อยแล้ว')
      onOpenChange(false)
      onDeleted()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ไม่สามารถลบข้อมูลได้')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ยืนยันการลบ</DialogTitle>
          <DialogDescription>
            คุณต้องการลบหน่วยงานนี้หรือไม่
            {department ? ` "${department.departmentName}"` : ''}
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
  )
}
