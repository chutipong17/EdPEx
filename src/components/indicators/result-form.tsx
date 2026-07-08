'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { resultFormSchema, type ResultFormValues } from '@/lib/validations'
import type { Indicator } from '@/types/indicators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ResultForm({
  indicator,
  onSuccess,
}: {
  indicator: Indicator
  onSuccess: () => void
}) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResultFormValues>({
    resolver: zodResolver(resultFormSchema),
    defaultValues: {
      resultValue: indicator.resultValue ?? undefined,
      description: '',
    },
  })

  async function onSubmit(values: ResultFormValues) {
    console.log('[v0] onSubmit fired', values)
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ indicatorId: indicator.id, ...values }),
    })

    if (res.status === 403) {
      toast.error('ไม่มีสิทธิ์ส่งผลของตัวชี้วัดนี้')
      return
    }
    if (!res.ok) {
      toast.error('บันทึกผลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
      return
    }

    toast.success('บันทึกผลลัพธ์เรียบร้อยแล้ว')
    router.refresh()
    onSuccess()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) =>
        console.log('[v0] validation errors', errs),
      )}
      className="flex flex-col gap-4"
    >
      {/* Result table layout */}
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="hidden grid-cols-[1fr_1fr_1.2fr_2fr] gap-3 bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground md:grid">
          <span>เวลาส่งมอบ</span>
          <span>เป้าหมาย</span>
          <span>ผลประเมิน</span>
          <span>รายละเอียด</span>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_1fr_1.2fr_2fr] md:items-start">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground md:hidden">
              เวลาส่งมอบ
            </span>
            <span className="text-sm text-foreground">
              {indicator.deliveryTime}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground md:hidden">
              เป้าหมาย
            </span>
            <span className="text-sm font-medium text-foreground">
              {indicator.target}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="resultValue" className="md:sr-only">
              ผลประเมิน
            </Label>
            <Input
              id="resultValue"
              type="number"
              step="any"
              min={0}
              placeholder="0.00"
              aria-invalid={Boolean(errors.resultValue)}
              {...register('resultValue', { valueAsNumber: true })}
            />
            {errors.resultValue ? (
              <p className="text-xs text-danger">{errors.resultValue.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="md:sr-only">
              รายละเอียด
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="อธิบายที่มาของผลลัพธ์ วิธีการเก็บข้อมูล และข้อสังเกต (อย่างน้อย 10 ตัวอักษร)"
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
            {errors.description ? (
              <p className="text-xs text-danger">{errors.description.message}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          <Save className="size-4" aria-hidden="true" />
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกผล'}
        </Button>
      </div>
    </form>
  )
}
