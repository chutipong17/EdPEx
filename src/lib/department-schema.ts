import { z } from 'zod'

export const departmentSchema = z.object({
  name: z
    .string({ message: 'กรุณากรอกชื่อหน่วยงาน' })
    .trim()
    .min(1, { message: 'กรุณากรอกชื่อหน่วยงาน' })
    .min(2, { message: 'ชื่อหน่วยงานต้องมีอย่างน้อย 2 ตัวอักษร' })
    .max(255, { message: 'ชื่อหน่วยงานต้องไม่เกิน 255 ตัวอักษร' }),
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>
