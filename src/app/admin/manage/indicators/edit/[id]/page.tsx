import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditIndicator } from "@/components/manage/Indicators/edit-indicator";
import { auth } from "@/lib/auth";

export default async function EditIndicatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <DashboardLayout user={session.user}>
      <EditIndicator id={id} />
    </DashboardLayout>
  );
}