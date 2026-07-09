import { NextResponse } from 'next/server'
import { mockDepartments } from '@/lib/mock-department'
import { departmentSchema } from '@/lib/department-schema'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const departmentId = Number(id)
  const index = mockDepartments.findIndex((dept) => dept.id === departmentId)

  if (index === -1) {
    return NextResponse.json(
      { message: 'ไม่พบหน่วยงานที่ต้องการแก้ไข' },
      { status: 404 },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = departmentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' },
      { status: 400 },
    )
  }

  mockDepartments[index] = {
    ...mockDepartments[index],
    name: parsed.data.name,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(mockDepartments[index])
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const departmentId = Number(id)
  const index = mockDepartments.findIndex((dept) => dept.id === departmentId)

  if (index === -1) {
    return NextResponse.json(
      { message: 'ไม่พบหน่วยงานที่ต้องการลบ' },
      { status: 404 },
    )
  }

  const [removed] = mockDepartments.splice(index, 1)

  return NextResponse.json(removed)
}
