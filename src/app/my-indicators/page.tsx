import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MyIndicatorsClient } from '@/components/indicators/my-indicators-client'

export default async function MyIndicatorsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <DashboardLayout user={session.user}>
      <MyIndicatorsClient
        userDepartment={String(
          session.user.departmentName ?? '',
        )}
        role={session.user.role}
      />
    </DashboardLayout>
  )
}