import { z } from 'zod'

export const resultFormSchema = z.object({
  resultValue: z
    .number({ message: 'กรุณากรอกผลประเมินเป็นตัวเลข' })
    .min(0, { message: 'ผลประเมินต้องไม่น้อยกว่า 0' }),
  description: z
    .string()
    .trim()
    .min(10, { message: 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร' }),
})

export type ResultFormValues = z.infer<typeof resultFormSchema>

export const createResultSchema = resultFormSchema.extend({
  indicatorId: z.number().int().positive(),
})
