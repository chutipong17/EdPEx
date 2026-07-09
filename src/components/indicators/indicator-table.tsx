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
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Pencil,
  Search,
} from 'lucide-react'
import type { Indicator } from '@/types/indicators'
import { STATUS_LABELS } from '@/types/indicators'
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
import { StatusBadge } from '@/components/indicators/status-badge'
import { IndicatorDetailDialog } from '@/components/indicators/indicator-detail-dialog'
import { cn } from '@/lib/utils'

function exportToCsv(rows: Indicator[]) {
  const headers = [
    'ปีข้อมูล',
    'ประเภทตัวชี้วัด',
    'รหัสตัวชี้วัด',
    'ตัวชี้วัด',
    'หน่วยงานที่รับผิดชอบ',
    'เวลาที่ส่งมอบ',
    'ระยะเวลาการเก็บข้อมูล',
    'เป้าหมาย',
    'หน่วยนับ',
    'ผลประเมิน',
    'สถานะ',
  ]
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const lines = rows.map((r) =>
    [
      r.dataYear,
      r.type,
      r.code,
      r.name,
      r.department,
      r.deliveryTime,
      r.collectionPeriod,
      r.target,
      r.unit,
      r.resultValue !== null ? String(r.resultValue) : '-',
      STATUS_LABELS[r.status],
    ]
      .map(escape)
      .join(','),
  )
  const csv = '\uFEFF' + [headers.map(escape).join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `edpex-indicators-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function IndicatorTable({ indicators }: { indicators: Indicator[] }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [selected, setSelected] = useState<Indicator | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  const openDialog = (indicator: Indicator, m: 'view' | 'edit') => {
    setSelected(indicator)
    setMode(m)
    setDialogOpen(true)
  }

  const columns = useMemo<ColumnDef<Indicator>[]>(
    () => [
      { accessorKey: 'dataYear', header: 'ปีข้อมูล' },
      { accessorKey: 'type', header: 'ประเภทตัวชี้วัด' },
      { accessorKey: 'code', header: 'รหัสตัวชี้วัด' },
      {
        accessorKey: 'name',
        header: 'ตัวชี้วัด',
        cell: ({ row }) => (
          <span className="block max-w-[280px] text-pretty">
            {row.original.name}
          </span>
        ),
      },
      { accessorKey: 'department', header: 'หน่วยงานที่รับผิดชอบ' },
      { accessorKey: 'deliveryTime', header: 'เวลาที่ส่งมอบ' },
      { accessorKey: 'collectionPeriod', header: 'ระยะเวลาการเก็บข้อมูล' },
      { accessorKey: 'target', header: 'เป้าหมาย' },
      { accessorKey: 'unit', header: 'หน่วยนับ' },
      {
        accessorKey: 'resultValue',
        header: 'ผลประเมิน',
        cell: ({ row }) =>
          row.original.resultValue !== null ? (
            <span className="font-medium">{row.original.resultValue}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
      {
        accessorKey: 'status',
        header: 'สถานะ',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: 'จัดการ',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openDialog(row.original, 'view')}
              className="gap-1.5 border-info/40 text-info hover:bg-info/10 hover:text-info"
            >
              <Eye className="size-4" aria-hidden="true" />
              ผลลัพธ์
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openDialog(row.original, 'edit')}
              className="gap-1.5 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
            >
              <Pencil className="size-4" aria-hidden="true" />
              เพิ่ม
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: indicators,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const filteredRows = table.getFilteredRowModel().rows.map((r) => r.original)

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="ค้นหาตัวชี้วัด..."
            className="pl-9"
            aria-label="ค้นหาตัวชี้วัด"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => exportToCsv(filteredRows)}
          className="gap-2 border-warning/50 text-warning hover:bg-warning/10 hover:text-warning"
        >
          <FileSpreadsheet className="size-4" aria-hidden="true" />
          Export Excel
        </Button>
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap text-xs font-semibold text-muted-foreground"
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <ArrowUpDown className="size-3" aria-hidden="true" />
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  ไม่พบตัวชี้วัด
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const ind = row.original
            return (
              <div
                key={row.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{ind.code}</p>
                    <p className="text-sm font-medium text-foreground text-pretty">
                      {ind.name}
                    </p>
                  </div>
                  <StatusBadge status={ind.status} />
                </div>
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">ปีข้อมูล</dt>
                    <dd className="text-foreground">{ind.dataYear}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">เป้าหมาย</dt>
                    <dd className="text-foreground">
                      {ind.target} {ind.unit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">เวลาส่งมอบ</dt>
                    <dd className="text-foreground">{ind.deliveryTime}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">ผลประเมิน</dt>
                    <dd className="text-foreground">
                      {ind.resultValue ?? '-'}
                    </dd>
                  </div>
                </dl>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(ind, 'view')}
                    className="flex-1 gap-1.5 border-info/40 text-info hover:bg-info/10 hover:text-info"
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    ผลลัพธ์
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(ind, 'edit')}
                    className="flex-1 gap-1.5 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    เพิ่ม
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            ไม่พบตัวชี้วัด
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          แสดง {table.getRowModel().rows.length} จาก{' '}
          {table.getFilteredRowModel().rows.length} รายการ
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="gap-1"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            ก่อนหน้า
          </Button>
          <span className="text-sm text-muted-foreground">
            หน้า {table.getState().pagination.pageIndex + 1} /{' '}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="gap-1"
          >
            ถัดไป
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <IndicatorDetailDialog
        indicator={selected}
        open={dialogOpen}
        mode={mode}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
