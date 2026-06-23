'use client'

import { useMemo, useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UserTable } from './user-table'
import { AddUserDialog } from './add-user-dialog'
import { EditUserDialog } from './edit-user-dialog'
import { ChangePasswordDialog } from './change-password-dialog'
import { mockUsers } from '@/lib/mock-users'
import type { User } from '@/types/user'
import type {
  AddUserValues,
  EditUserValues,
} from '@/lib/user-schema'

const PAGE_SIZE = 5

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('ellipsis')
  pages.push(total)
  return pages
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [activeUser, setActiveUser] = useState<User | null>(null)
 

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      [u.username, u.fullname, u.email, u.department, u.phone]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }, [users, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageUsers = filtered.slice(startIndex, startIndex + PAGE_SIZE)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleAdd(values: AddUserValues) {
    const newUser: User = {
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      username: values.username,
      fullname: values.fullname,
      email: values.email,
      department: values.department,
      phone: values.phone,
      role: values.role,
    }
    setUsers((prev) => [newUser, ...prev])
    toast.success('เพิ่มผู้ใช้งานสำเร็จ', {
      description: `เพิ่ม ${values.fullname} เข้าสู่ระบบแล้ว`,
    })
  }

  function handleEdit(values: EditUserValues) {
    if (!activeUser) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === activeUser.id ? { ...u, ...values } : u
      )
    )
    toast.success('บันทึกการแก้ไขสำเร็จ', {
      description: `ปรับปรุงข้อมูลของ ${values.fullname} แล้ว`,
    })
  }

  function handleChangePassword() {
    toast.success('เปลี่ยนรหัสผ่านสำเร็จ', {
      description: `อัปเดตรหัสผ่านของ ${activeUser?.username ?? ''} แล้ว`,
    })
  }

  function handleDelete() {
    if (!activeUser) return
    setUsers((prev) => prev.filter((u) => u.id !== activeUser.id))
    toast.success('ลบผู้ใช้งานสำเร็จ', {
      description: `ลบ ${activeUser.fullname} ออกจากระบบแล้ว`,
    })
    setDeleteOpen(false)
    setActiveUser(null)
  }

  function goToPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[#1e40af] text-balance">
          กำหนดข้อมูลผู้ใช้งาน
        </h1>
        <p className="text-sm text-muted-foreground">
          จัดการบัญชีผู้ใช้งาน สิทธิ์การเข้าถึง และข้อมูลหน่วยงานในระบบ EdPEx
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
              setActiveUser(user)
              setEditOpen(true)
            }}
            onChangePassword={(user) => {
              setActiveUser(user)
              setPasswordOpen(true)
            }}
            onDelete={(user) => {
              setActiveUser(user)
              setDeleteOpen(true)
            }}
          />
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            แสดง {filtered.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + PAGE_SIZE, filtered.length)} จากทั้งหมด{' '}
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
                      ? 'pointer-events-none opacity-50'
                      : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    goToPage(currentPage - 1)
                  }}
                />
              </PaginationItem>
              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        goToPage(p)
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="ถัดไป"
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    goToPage(currentPage + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

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
              คุณต้องการลบ &ldquo;{activeUser?.fullname}&rdquo; ออกจากระบบใช่หรือไม่?
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
            >
              ลบผู้ใช้งาน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
