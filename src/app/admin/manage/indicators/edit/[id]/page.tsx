import { notFound } from "next/navigation";

import { IndicatorForm } from "@/components/manage/Indicators/indicator-form";
import { getIndicatorById } from "@/lib/mock-indicators";
import { indicatorToFormValues } from "@/lib/indicator-mapper";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
export default async function EditIndicatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const indicator = getIndicatorById(id);

  if (!indicator) {
    notFound();
  }
   const session = await auth()
      if (!session) {
        redirect('/login')
      }

  return (
    <DashboardLayout user={session.user}>
      <IndicatorForm
        mode="edit"
        title="แก้ไขตัวชี้วัด"
        initialValues={indicatorToFormValues(indicator)}
      />
    </DashboardLayout>
  );
}
