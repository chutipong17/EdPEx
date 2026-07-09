import { IndicatorForm } from "@/components/manage/Indicators/indicator-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
export default async function CreateIndicatorPage() {
   const session = await auth()
      if (!session) {
        redirect('/login')
      }
  return (
    <DashboardLayout user={session.user}>
      <IndicatorForm mode="create" title="เพิ่มตัวชี้วัด" />
    </DashboardLayout>
  );
}
