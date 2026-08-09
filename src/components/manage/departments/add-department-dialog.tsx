'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

import type { DepartmentFormValues } from '@/lib/department-schema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DepartmentForm } from './department-form'

interface AddDepartmentDialogProps {
  onCreated: () => void
}

export function AddDepartmentDialog({ onCreated }: AddDepartmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(values: DepartmentFormValues) {
    setSubmitting(true)
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/department`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message ?? 'ไม่สามารถบันทึกข้อมูลได้')
      }
      toast.success('เพิ่มหน่วยงานเรียบร้อยแล้ว')
      setOpen(false)
      onCreated()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'ไม่สามารถบันทึกข้อมูลได้',
      )
    } finally {
      setSubmitting(false)
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
        เพิ่มหน่วยงาน
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>เพิ่มหน่วยงาน</DialogTitle>
          <DialogDescription>
            กรอกชื่อหน่วยงานที่ต้องการเพิ่มเข้าสู่ระบบ
          </DialogDescription>
        </DialogHeader>
        {open && (
          <DepartmentForm submitting={submitting} onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </Dialog>
  )
}
