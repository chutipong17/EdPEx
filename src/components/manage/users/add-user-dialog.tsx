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
import { addUserSchema, type AddUserValues } from '@/lib/user-schema'

const defaultValues: AddUserValues = {
  department: '',
  fullname: '',
  role: 'USER',
  email: '',
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
}

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: AddUserValues) => void
}

//API
// interface AddUserDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onSubmit: (values: AddUserValues) => Promise<void>
// }

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddUserDialogProps) {
  const form = useForm<AddUserValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, form])

  // const handleSubmit = form.handleSubmit((values) => {
  //   onSubmit(values)
  //   onOpenChange(false)
  // })
  const handleSubmit = form.handleSubmit(async (values) => {
  try {
    await onSubmit(values)
    form.reset()
    onOpenChange(false)
  } catch (error) {
    console.error(error)
  }
})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] gap-0 overflow-y-auto p-0 sm:max-w-[800px]">
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-lg font-semibold">
            เพิ่มผู้ใช้งาน
          </DialogTitle>
          <DialogDescription>
            กรอกข้อมูลผู้ใช้งานใหม่ให้ครบถ้วน ช่องที่มีเครื่องหมาย * เป็นข้อมูลที่จำเป็น
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <UserFormFields form={form} showPassword />
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
