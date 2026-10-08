import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'

import {
  createResult,
  userOwnsIndicator,
} from '@/lib/data'

import { createResultSchema } from '@/lib/validations'

// POST /api/results
//
// Creates a result record.
// Ownership is validated before any write.

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      },
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        error: 'Invalid JSON body',
      },
      {
        status: 400,
      },
    )
  }

  const parsed =
    createResultSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: parsed.error.flatten(),
      },
      {
        status: 422,
      },
    )
  }

  /**
   * Row Level Security
   *
   * ตรวจสอบว่า Indicator เป็นของ user
   * ก่อนที่จะอนุญาตให้สร้าง Result
   */
  const ownsIndicator =
    await userOwnsIndicator(
      parsed.data.indicatorId,
      session.user.id,
    )

  if (!ownsIndicator) {
    return NextResponse.json(
      {
        error: 'Forbidden',
      },
      {
        status: 403,
      },
    )
  }

  try {
    /**
     * userId ถูกบังคับจาก session
     * ไม่รับ userId จาก client
     */
    const record = await createResult(
      parsed.data,
      session.user.id,
    )

    return NextResponse.json(
      {
        data: record,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error(
      'Create result error:',
      error,
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'ไม่สามารถบันทึกผลได้',
      },
      {
        status: 500,
      },
    )
  }
}