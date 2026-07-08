import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getIndicatorsForUser } from '@/lib/data'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { IndicatorTable } from '@/components/indicators/indicator-table'

export default async function MyIndicatorsPage() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  // Row Level Security: only fetch indicators owned by the logged-in user.
  const indicators = getIndicatorsForUser(session.user.id)

  return (
    <DashboardLayout  user={session.user}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold text-info">รายการตัวชี้วัด</h1>
          <p className="text-sm text-muted-foreground">
            ตัวชี้วัดที่อยู่ในความรับผิดชอบของคุณ ({indicators.length} รายการ)
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <IndicatorTable indicators={indicators} />
        </div>
      </div>
    </DashboardLayout>
  )
}
