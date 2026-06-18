import { UserLayout } from "@/components/manage/users/user-layout";
import { UsersPage } from "@/components/manage/users/users-page";

export default function UserManage() {
  return (
    <UserLayout>
      <UsersPage />
    </UserLayout>
  );
}
