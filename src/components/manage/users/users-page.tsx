"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserTable } from "./user-table";
import { AddUserDialog } from "./add-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
// import { mockUsers } from "@/lib/mock-users";
import {
  useGetAllUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useGetUserById,
  useChangePassword,
} from "@/service/user/user";
import type { User } from "@/types/user";
import type {
  AddUserValues,
  EditUserValues,
  ChangePasswordValues,
} from "@/lib/user-schema";
import {
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "@/components/serveices/authService";
const PAGE_SIZE = 5;



function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const { mutateAsync: createUser, isPending } = useCreateUser();
  const { mutateAsync: updateUserUser } = useUpdateUser();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: changePasswordUser } = useChangePassword();

  const {
    data: AllUsers,
    isLoading: usersLoading,
    error: usersError,
    refetch: mutate,
  } = useGetAllUsers();

  useEffect(() => {
    setUsers(AllUsers?.data ?? []);
  }, [AllUsers]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [
        u.username,
        `${u.firstName} ${u.lastName}`,
        u.email,
        u.department,
        u.mobileNumber,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageUsers = filtered.slice(startIndex, startIndex + PAGE_SIZE);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function handleAdd(values: AddUserValues): Promise<void> {
    try {
      const payload = {
        ...values,
        department: Number(values.department), // Convert department to number
        role: Number(values.role), // Convert role to number
      };
      const response = await createUser({
        body: payload,
      });

      console.log("response:", response);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถเพิ่มผู้ใช้งานได้");
      }

      toast.success("เพิ่มผู้ใช้งานสำเร็จ");

      setAddOpen(false);

      // ถ้ามี state users
      setUsers((prev) => [result.data, ...prev]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถเพิ่มผู้ใช้งานได้",
      );
    }
  }

  async function handleEdit(values: EditUserValues): Promise<void> {
    if (!activeUser) return;

    try {
      // await updateUser(activeUser.id, values)
      console.log("values EDIT === :", values, "  ", activeUser.id);
      const payload = {
        departmentId: Number(values.departmentId),
        roleId: Number(values.roleId),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobileNumber: values.mobileNumber,
        username: values.username,
      };

      await updateUserUser({
        id: activeUser.id,
        body: payload,
      });

      //  const res = await updateUserUser({
      //   id: activeUser.id,
      //   body: {
      //     ...values,
      //      department: Number(values.department), // Convert department to number
      //      role: Number(values.role), // Convert role to number
      //   },
      // });
      // setUsers((prev) =>
      //   prev.map((u) =>
      //     u.id === activeUser.id
      //       ? {
      //           ...u,
      //           ...values,
      //         }
      //       : u
      //   )
      // )

      toast.success("บันทึกการแก้ไขสำเร็จ", {
        description: `ปรับปรุงข้อมูลของ ${values.firstName} ${values.lastName} แล้ว`,
      });
    } catch (error) {
      toast.error("ไม่สามารถแก้ไขข้อมูลผู้ใช้งานได้");

      throw error;
    }
  }

  // function handleChangePassword() {
  //   toast.success("เปลี่ยนรหัสผ่านสำเร็จ", {
  //     description: `อัปเดตรหัสผ่านของ ${activeUser?.username ?? ""} แล้ว`,
  //   });
  // }

  async function handleChangePassword(
    values: ChangePasswordValues,
  ): Promise<void> {
    if (!activeUser) return;

    try {
      console.log("values ChangePassword === :", values, "  ", activeUser.id);
      // await changePassword(activeUser.id, values)

      await changePasswordUser({
        body: {
          userId: activeUser.id,
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
      });

      toast.success("เปลี่ยนรหัสผ่านสำเร็จ", {
        description: `อัปเดตรหัสผ่านของ ${activeUser.username} แล้ว`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถเปลี่ยนรหัสผ่านได้",
      );

      throw error;
    }
  }

  // function handleDelete() {
  //   if (!activeUser) return;
  //   setUsers((prev) => prev.filter((u) => u.id !== activeUser.id));
  //   toast.success("ลบผู้ใช้งานสำเร็จ", {
  //     description: `ลบ ${activeUser.fullname} ออกจากระบบแล้ว`,
  //   });
  //   setDeleteOpen(false);
  //   setActiveUser(null);
  // }

  async function handleDelete(): Promise<void> {
    if (!activeUser) return;

    try {
      // await deleteUser(activeUser.id)
      await deleteUser({ id: activeUser.id });

      setUsers((prev) => prev.filter((u) => u.id !== activeUser.id));

      toast.success("ลบผู้ใช้งานสำเร็จ", {
        description: `ลบ ${activeUser.username} ออกจากระบบแล้ว`,
      });

      setDeleteOpen(false);
      setActiveUser(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถลบผู้ใช้งานได้",
      );

      throw error;
    }
  }

  function goToPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[#1e40af] text-balance">
          กำหนดข้อมูลผู้ใช้งาน
        </h1>
        <p className="text-sm text-muted-foreground">
          จัดการบัญชีผู้ใช้งาน ในระบบ EdPEx
        </p>
      </header>

      <section className="rounded-[20px] border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="ค้นหาผู้ใช้งาน, อีเมล, หน่วยงาน..."
              className="pl-9"
              aria-label="ค้นหาผู้ใช้งาน"
            />
          </div>
          <Button
            variant="outline"
            className="border-info/50 text-info hover:bg-info hover:text-info-foreground"
            onClick={() => setAddOpen(true)}
          >
            <UserPlus data-icon="inline-start" />
            เพิ่มผู้ใช้งาน
          </Button>
        </div>

        <div className="mt-4">
          <UserTable
            users={pageUsers}
            startIndex={startIndex}
            onEdit={(user) => {
              setActiveUser(user);
              setEditOpen(true);
            }}
            onChangePassword={(user) => {
              setActiveUser(user);
              setPasswordOpen(true);
            }}
            onDelete={(user) => {
              setActiveUser(user);
              setDeleteOpen(true);
            }}
          />
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            แสดง {filtered.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + PAGE_SIZE, filtered.length)} จากทั้งหมด{" "}
            {filtered.length} รายการ
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="ก่อนหน้า"
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {pageNumbers.map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="ถัดไป"
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* <AddUserDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      /> */}

      <AddUserDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={activeUser}
        onSubmit={handleEdit}
      />
      <ChangePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        user={activeUser}
        onSubmit={handleChangePassword}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบผู้ใช้งาน</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบ &ldquo;{activeUser?.firstName} {activeUser?.lastName}
              &rdquo; ออกจากระบบใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              ลบผู้ใช้งาน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
