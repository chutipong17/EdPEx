import { ResultsDashboard } from "@/components/results/results-dashbord";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
export default async function ResultsPage() {
      const session = await auth()
    if (!session) {
      redirect('/login')
    }
  return (
    <DashboardLayout  user={session.user}>
      <ResultsDashboard />
    </DashboardLayout>
  );
}
