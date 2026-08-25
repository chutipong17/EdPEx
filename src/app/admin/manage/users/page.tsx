import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UsersPage } from "@/components/manage/users/users-page";
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function UserManage() {
   const session = await auth()
    if (!session) {
      redirect('/login')
    }
    console.log("session.user.roleNameEn === "+session.user.role);
  
  return (
    <DashboardLayout user={session.user}>
      <UsersPage />
    </DashboardLayout>
  );
}
