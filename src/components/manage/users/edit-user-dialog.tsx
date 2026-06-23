'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserFormFields } from './user-form'
import { editUserSchema, type EditUserValues } from '@/lib/user-schema'
import type { User } from '@/types/user'

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSubmit: (values: EditUserValues) => void
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: EditUserDialogProps) {
  const form = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      department: '',
      fullname: '',
      role: 'USER',
      email: '',
      phone: '',
      username: '',
    },
  })

  useEffect(() => {
    if (open && user) {
      form.reset({
        department: user.department === 'ไม่มี' ? '' : user.department,
        fullname: user.fullname,
        role: user.role,
        email: user.email,
        phone: user.phone,
        username: user.username,
      })
    }
  }, [open, user, form])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] gap-0 overflow-y-auto p-0 sm:max-w-[800px]">
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-lg font-semibold">
            แก้ไขผู้ใช้งาน
          </DialogTitle>
          <DialogDescription>
            ปรับปรุงข้อมูลของ {user?.fullname ?? 'ผู้ใช้งาน'} ตามต้องการ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <UserFormFields form={form} />
          </div>

          <DialogFooter className="mx-0 mb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              ย้อนกลับ
            </Button>
            <Button type="submit">บันทึกข้อมูล</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
