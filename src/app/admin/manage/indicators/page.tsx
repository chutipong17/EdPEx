import { IndicatorList } from "@/components/manage/Indicators/indicator-list"
import { indicators } from "@/lib/mock-indicators"
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
export default async function IndicatorsPage() {
    const session = await auth()
    if (!session) {
      redirect('/login')
    }
  
  return (

    <DashboardLayout  user={session.user}>
        <IndicatorList indicators={indicators} />
    </DashboardLayout>
   
  )
  
}

