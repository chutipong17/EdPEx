import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createResult, userOwnsIndicator } from '@/lib/data'
import { createResultSchema } from '@/lib/validations'

// POST /api/results
// Creates a result record. Ownership is validated before any write.
export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = createResultSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 },
    )
  }

  // Row Level Security: the user may only submit results for indicators they own.
  if (!userOwnsIndicator(parsed.data.indicatorId, session.user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // userId is forced to the session user — never taken from the request.
  const record = createResult(parsed.data, session.user.id)
  return NextResponse.json({ data: record }, { status: 201 })
}
