'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import type { DepartmentFormValues } from '@/lib/department-schema'
import type { Department } from '@/types/department'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DepartmentForm } from './department-form'
import { useUpdateDepartment } from '@/service/department/department'
interface EditDepartmentDialogProps {
  department: Department | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EditDepartmentDialog({
  department,
  open,
  onOpenChange,
  onUpdated,
}: EditDepartmentDialogProps) {
  const [submitting, setSubmitting] = useState(false)
const { mutateAsync: updateDepartment } = useUpdateDepartment();

  async function handleSubmit(values: DepartmentFormValues) {
    if (!department) return
    setSubmitting(true)
    try {
     const res = await updateDepartment({
      id: department.id,
      body: {
        departmentName: values.departmentName,
      },
    });

      // if (!res.ok) {
      //   const data = await res.json().catch(() => null)
      //   throw new Error(data?.message ?? 'ไม่สามารถบันทึกข้อมูลได้')
      // }
      toast.success('แก้ไขชื่อหน่วยงานเรียบร้อยแล้ว')
      onOpenChange(false)
      onUpdated()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'ไม่สามารถบันทึกข้อมูลได้',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>แก้ไขชื่อหน่วยงาน</DialogTitle>
          <DialogDescription>
            แก้ไขชื่อหน่วยงานแล้วกดบันทึกข้อมูลเพื่อยืนยัน
          </DialogDescription>
        </DialogHeader>
        {open && department && (
          <DepartmentForm
            defaultName={department.departmentName}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
