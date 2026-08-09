import type { IndicatorType } from "@/types/indicator-type"
const now = new Date().toISOString()



export const mockIndicatorTypes: IndicatorType[] = [
  {
    id: 1,
    name: 'ตัวชีวัด EdPEx',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: 'ตัวชีวัด OKRs',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: 'ตัวชี้วัดกลยุทธ',
    createdAt: now,
    updatedAt: now,
  },
]
