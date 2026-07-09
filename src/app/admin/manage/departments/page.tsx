import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DepartmentManager } from "@/components/manage/departments/department-manager";
export default async function DepartmentsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <DashboardLayout user={session.user}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-[#1e40af] text-balance">
            กำหนดข้อมูลหน่วยงาน
          </h1>
          <p className="text-sm text-muted-foreground">
            จัดการข้อมูลหน่วยงานในระบบ EdPEx
          </p>
        </header>
        <DepartmentManager />
      </div>
    </DashboardLayout>
  );
}
