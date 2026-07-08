import { NextResponse } from "next/server";
import { mockIndicatorTypes } from "@/lib/mock-indicator-types";
import { indicatorTypeSchema } from "@/lib/indicator-type-schema";


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const departmentId = Number(id)
  const index = mockIndicatorTypes.findIndex((dept) => dept.id === departmentId)

  if (index === -1) {
    return NextResponse.json(
      { message: 'ไม่พบประเภทตัวชี้วัดที่ต้องการแก้ไข' },
      { status: 404 },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = indicatorTypeSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' },
      { status: 400 },
    )
  }

  mockIndicatorTypes[index] = {
    ...mockIndicatorTypes[index],
    name: parsed.data.name,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(mockIndicatorTypes[index])
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const departmentId = Number(id)
  const index = mockIndicatorTypes.findIndex((dept) => dept.id === departmentId)

  if (index === -1) {
    return NextResponse.json(
      { message: 'ไม่พบประเภทตัวชี้วัดที่ต้องการลบ' },
      { status: 404 },
    )
  }

  const [removed] = mockIndicatorTypes.splice(index, 1)

  return NextResponse.json(removed)
}
