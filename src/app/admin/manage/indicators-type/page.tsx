import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { IndicatorTypeManager } from "@/components/manage/indicators-type/indicator-type-manager";
export default async function IndicatorTypes (){
     const session = await auth();
      if (!session) {
        redirect("/login");
      }
    return (
       <DashboardLayout user={session.user}>
        <IndicatorTypeManager />
       </DashboardLayout>
    )
}