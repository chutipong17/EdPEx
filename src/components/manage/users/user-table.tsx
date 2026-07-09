'use client'

import { KeyRound, Pencil, Trash2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Users } from 'lucide-react'
import type { User, UserRole} from '@/types/user'

const roleStyles: Record<UserRole, string> = {
  ADMIN: 'border-primary/30 bg-accent text-primary',
  MANAGER: 'border-warning/30 bg-warning/10 text-warning',
  USER: 'border-info/30 bg-info/10 text-info',
}

interface UserTableProps {
  users: User[]
  startIndex: number
  onEdit: (user: User) => void
  onChangePassword: (user: User) => void
  onDelete: (user: User) => void
}

export function UserTable({
  users,
  startIndex,
  onEdit,
  onChangePassword,
  onDelete,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <Empty className="rounded-xl border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>ไม่พบข้อมูลผู้ใช้งาน</EmptyTitle>
          <EmptyDescription>
            ลองปรับคำค้นหา หรือเพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted">
          <TableRow className="hover:bg-muted">
            <TableHead className="w-16 text-center">ลำดับ</TableHead>
            <TableHead className="min-w-32">Username</TableHead>
            <TableHead className="min-w-40">ชื่อ-นามสกุล</TableHead>
            <TableHead className="min-w-52">อีเมล</TableHead>
            <TableHead className="min-w-48">หน่วยงาน</TableHead>
            <TableHead className="min-w-36">หมายเลขโทรศัพท์</TableHead>
            <TableHead className="min-w-72 text-center">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id} className="transition-colors">
              <TableCell className="text-center text-muted-foreground">
                {startIndex + index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.username}</span>
                  <Badge
                    variant="outline"
                    className={`px-1.5 py-0 text-[10px] ${roleStyles[user.role]}`}
                  >
                    {user.role}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{user.fullname}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.department}
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {user.phone}
              </TableCell>
              
              <TableCell>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-warning/40 text-warning hover:bg-warning hover:text-warning-foreground font-light"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil data-icon="inline-start" size={16}/>
                    แก้ไข
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground font-light"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 data-icon="inline-start" size={16}/>
                    ลบ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-info/40 text-info hover:bg-info hover:text-info-foreground font-light"
                    onClick={() => onChangePassword(user)}
                  >
                    <KeyRound data-icon="inline-start" size={16}/>
                    เปลี่ยนรหัสผ่าน
                  </Button>
                </div>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
