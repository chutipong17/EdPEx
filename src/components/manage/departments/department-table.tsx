
'use client'

import { useMemo, useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Search, Trash2 } from 'lucide-react'

import type { Department } from '@/types/department'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface DepartmentTableProps {
  data: Department[]
  loading?: boolean
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
}

const PAGE_SIZE = 10

export function DepartmentTable({
  data,
  loading = false,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        id: 'index',
        header: 'ลำดับ',
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination
          return (
            <span className="font-medium text-muted-foreground">
              {pageIndex * pageSize + row.index + 1}
            </span>
          )
        },
        enableSorting: false,
        meta: { className: 'w-20' },
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <button
            type="button"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
            className="flex items-center gap-1.5 font-medium outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            ชื่อหน่วยงาน
            <ArrowUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.name}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">จัดการ</span>,
        enableSorting: false,
        meta: { className: 'w-44 text-right' },
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(row.original)}
              className="gap-1.5 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
              aria-label={`แก้ไข ${row.original.name}`}
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              แก้ไข
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(row.original)}
              className="gap-1.5 border-danger/40 text-danger hover:bg-danger/10 hover:text-danger"
              aria-label={`ลบ ${row.original.name}`}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              ลบ
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  })

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="ค้นหาชื่อหน่วยงาน"
          className="pl-9"
          aria-label="ค้นหาชื่อหน่วยงาน"
        />
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { className?: string }
                    | undefined
                  return (
                    <TableHead
                      key={header.id}
                      className={cn('h-12 text-foreground', meta?.className)}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { className?: string }
                      | undefined
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn('py-3', meta?.className)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {loading ? 'กำลังโหลดข้อมูล...' : 'ไม่พบข้อมูลหน่วยงาน'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.length ? (
          rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    ลำดับ{' '}
                    {currentPage * PAGE_SIZE + row.index + 1}
                  </span>
                  <span className="font-medium text-foreground">
                    {row.original.name}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(row.original)}
                  className="flex-1 gap-1.5 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  แก้ไข
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(row.original)}
                  className="flex-1 gap-1.5 border-danger/40 text-danger hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  ลบ
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            {loading ? 'กำลังโหลดข้อมูล...' : 'ไม่พบข้อมูลหน่วยงาน'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="ก่อนหน้า"
                aria-disabled={!table.getCanPreviousPage()}
                className={cn(
                  !table.getCanPreviousPage() &&
                    'pointer-events-none opacity-50',
                )}
                onClick={(event) => {
                  event.preventDefault()
                  table.previousPage()
                }}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={index === currentPage}
                  onClick={(event) => {
                    event.preventDefault()
                    table.setPageIndex(index)
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                text="ถัดไป"
                aria-disabled={!table.getCanNextPage()}
                className={cn(
                  !table.getCanNextPage() && 'pointer-events-none opacity-50',
                )}
                onClick={(event) => {
                  event.preventDefault()
                  table.nextPage()
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
