import type { Department } from '@/types/department'

const now = new Date().toISOString()

// In-memory store used by the API route handlers (resets on server restart).
export const mockDepartments: Department[] = [
  {
    id: 1,
    name: 'งานแผนยุทธศาสตร์',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: 'สำนักวิชาการ',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: 'กองกลาง',
    createdAt: now,
    updatedAt: now,
  },
]
