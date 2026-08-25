import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { IndicatorDetail } from "@/components/manage/Indicators/indicator-detail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function IndicatorDetailPage({
  params,
}: PageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <DashboardLayout user={session.user}>
      <IndicatorDetail id={id} />
    </DashboardLayout>
  );
}