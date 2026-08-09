import { z } from 'zod'

export const indicatorTypeSchema = z.object({
  categoryName: z
    .string({ message: 'กรุณากรอกประเภทตัวชี้วัด' })
    .trim()
    .min(1, { message: 'กรุณากรอกประเภทตัวชี้วัด' })
    .min(2, { message: 'ประเภทตัวชี้วัดต้องมีอย่างน้อย 2 ตัวอักษร' })
    .max(255, { message: 'ประเภทตัวชี้วัดต้องไม่เกิน 255 ตัวอักษร' }),
})

export type IndicatorTypeFormValues = z.infer<typeof indicatorTypeSchema>
