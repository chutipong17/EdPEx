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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/lib/user-schema'
import type { User } from '@/types/user'

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSubmit: (values: ChangePasswordValues) => void
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: ChangePasswordDialogProps) {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const {
    register,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) {
      form.reset({ password: '', confirmPassword: '' })
    }
  }, [open, form])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] gap-0 p-0 sm:max-w-[600px]">
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-lg font-semibold">
            เปลี่ยนรหัสผ่าน
          </DialogTitle>
          <DialogDescription>
            กำหนดรหัสผ่านใหม่สำหรับ {user?.username ?? 'ผู้ใช้งาน'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <FieldGroup>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="new-password">รหัสผ่านใหม่</FieldLabel>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <FieldError errors={[errors.password]} />
              </Field>

              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirm-new-password">
                  ยืนยันรหัสผ่าน
                </FieldLabel>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <FieldError errors={[errors.confirmPassword]} />
              </Field>
            </FieldGroup>
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
