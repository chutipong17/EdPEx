import { NextResponse } from 'next/server'

import { departmentSchema } from '@/lib/department-schema'

const API_URL = process.env.API_URL

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const departmentId = Number(id)

  if (Number.isNaN(departmentId)) {
    return NextResponse.json(
      { message: 'รหัสหน่วยงานไม่ถูกต้อง' },
      { status: 400 },
    )
  }

  const body = await request.json().catch(() => null)

  const parsed = departmentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง',
      },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(
      `${API_URL}/api/departments/${departmentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
        cache: 'no-store',
      },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ?? 'ไม่สามารถแก้ไขหน่วยงานได้',
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('Update department error:', error)

    return NextResponse.json(
      {
        message: 'ไม่สามารถเชื่อมต่อ API ได้',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const departmentId = Number(id)

  if (Number.isNaN(departmentId)) {
    return NextResponse.json(
      { message: 'รหัสหน่วยงานไม่ถูกต้อง' },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(
      `${API_URL}/api/departments/${departmentId}`,
      {
        method: 'DELETE',
        cache: 'no-store',
      },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ?? 'ไม่สามารถลบหน่วยงานได้',
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('Delete department error:', error)

    return NextResponse.json(
      {
        message: 'ไม่สามารถเชื่อมต่อ API ได้',
      },
      { status: 500 },
    )
  }
}