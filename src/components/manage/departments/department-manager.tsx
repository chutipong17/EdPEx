'use client'

import { useState } from 'react'
import useSWR from 'swr'

import type { Department } from '@/types/department'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DepartmentTable } from './department-table'
import { AddDepartmentDialog } from './add-department-dialog'
import { EditDepartmentDialog } from './edit-department-dialog'
import { DeleteDepartmentDialog } from './delete-department-dialog'
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้')
    return res.json() as Promise<Department[]>
  })

export function DepartmentManager() {
  const { data, isLoading, mutate } = useSWR<Department[]>(
   `${process.env.NEXT_PUBLIC_API_URL}/api/department`,
    fetcher,
  )

  const [editTarget, setEditTarget] = useState<Department | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleEdit(department: Department) {
    setEditTarget(department)
    setEditOpen(true)
  }

  function handleDelete(department: Department) {
    setDeleteTarget(department)
    setDeleteOpen(true)
  }

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg">รายการหน่วยงาน</CardTitle>
        <AddDepartmentDialog onCreated={() => mutate()} />
      </CardHeader>
      <CardContent>
        <DepartmentTable
          data={data ?? []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>

      <EditDepartmentDialog
        department={editTarget}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={() => mutate()}
      />
      <DeleteDepartmentDialog
        department={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => mutate()}
      />
    </Card>
  )
}
