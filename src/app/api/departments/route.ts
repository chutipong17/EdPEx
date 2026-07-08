import { NextResponse } from 'next/server'
import { mockDepartments } from '@/lib/mock-department'
import { departmentSchema } from '@/lib/department-schema'

export async function GET() {
  return NextResponse.json(mockDepartments)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = departmentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' },
      { status: 400 },
    )
  }

  const now = new Date().toISOString()
  const nextId =
    mockDepartments.reduce((max, dept) => Math.max(max, dept.id), 0) + 1

  const department = {
    id: nextId,
    name: parsed.data.name,
    createdAt: now,
    updatedAt: now,
  }

  mockDepartments.push(department)

  return NextResponse.json(department, { status: 201 })
}
