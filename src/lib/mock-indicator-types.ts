import type { IndicatorType } from "@/types/indicator-type"
const now = new Date().toISOString()

export const mockIndicatorTypes: IndicatorType[] = [
  {
    id: 1,
    categoryName: 'ตัวชี้วัด EdPEx',
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 2,
    categoryName: 'ตัวชี้วัด OKRs',
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 3,
    categoryName: 'ตัวชี้วัดกลยุทธ',
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    createdBy: 'system',
    updatedBy: 'system',
  },
]