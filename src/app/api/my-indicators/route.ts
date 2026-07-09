import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getIndicatorsForUser } from '@/lib/data'

// GET /api/my-indicators
// Returns ONLY indicators where assignedUserId === session.user.id
export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const indicators = getIndicatorsForUser(session.user.id)
  return NextResponse.json({ data: indicators })
}
