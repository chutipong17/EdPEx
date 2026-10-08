import type { Department } from '@/types/department'

const now = new Date().toISOString()

// In-memory store used by the API route handlers (resets on server restart).
export const mockDepartments: Department[] = [
  {
    id: 1,
    departmentName: 'งานแผนยุทธศาสตร์',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    departmentName: 'สำนักวิชาการ',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    departmentName: 'กองกลาง',
    createdAt: now,
    updatedAt: now,
  },
]
