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
import { useGetDepartments } from '@/service/department/department'

export function DepartmentManager() {
  const {
     data: departments,
     isLoading: departmentsLoading,
     error: departmentsError,
     refetch: mutate,
   } = useGetDepartments();

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
          data={departments?.data ?? []}
          loading={departmentsLoading}
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
