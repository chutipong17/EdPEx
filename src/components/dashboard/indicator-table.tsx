'use client'

import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Indicator, IndicatorStatus } from '@/types/dashboard'
import {
  CircleCheck,
  CircleAlert,
  CircleX,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const statusConfig: Record<
  IndicatorStatus,
  { label: string; icon: typeof CircleCheck; className: string }
> = {
  pass: { label: 'ผ่าน', icon: CircleCheck, className: 'text-success' },
  fail: { label: 'ยังไม่ผ่าน', icon: CircleAlert, className: 'text-warning' },
  'no-data': { label: 'ไม่มีข้อมูล', icon: CircleX, className: 'text-danger' },
}

function StatusBadge({ status }: { status: IndicatorStatus }) {
  const { label, icon: Icon, className } = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', className)}>
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </span>
  )
}

const columns = [
  'ปีข้อมูล',
  'รหัสตัวชี้วัด',
  'ชื่อตัวชี้วัด',
  'หน่วยงานผู้รับผิดชอบ',
  'ผู้รับผิดชอบ',
  'ประเภทข้อมูล',
  'เป้าหมาย',
  'หน่วยนับ',
  'ผลประเมิน',
  'สถานะ',
]

export function IndicatorTable({ data }: { data: Indicator[] }) {
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q) ||
        d.owner.toLowerCase().includes(q),
    )
  }, [data, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">รายละเอียดตัวชี้วัด</h2>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="ค้นหาตัวชี้วัด รหัส หน่วยงาน..."
            className="h-10 rounded-lg pl-9"
            aria-label="ค้นหาตัวชี้วัด"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">แสดง</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v))
              setPage(1)
            }}
          >
            <SelectTrigger className="h-10 w-[88px] rounded-lg" aria-label="จำนวนแถวต่อหน้า">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">รายการ</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-[#FAFAFA] hover:bg-[#FAFAFA] dark:bg-secondary">
              {columns.map((c) => (
                <TableHead
                  key={c}
                  className="whitespace-nowrap text-xs font-semibold text-muted-foreground"
                >
                  {c}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  ไม่พบข้อมูลตัวชี้วัด
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="h-14 hover:bg-secondary/60">
                  <TableCell className="text-sm">{row.year}</TableCell>
                  <TableCell className="text-sm font-medium">{row.code}</TableCell>
                  <TableCell className="min-w-[240px] text-sm">{row.name}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{row.department}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{row.owner}</TableCell>
                  <TableCell className="text-sm">{row.dataType}</TableCell>
                  <TableCell className="text-sm tabular-nums">{row.target}</TableCell>
                  <TableCell className="text-sm">{row.unit}</TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {row.result ?? '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length === 0
            ? 'ไม่มีรายการ'
            : `แสดง ${start + 1}–${Math.min(start + pageSize, filtered.length)} จาก ${filtered.length} รายการ`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current <= 1}
            aria-label="หน้าก่อนหน้า"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            ก่อนหน้า
          </Button>
          <span className="text-sm tabular-nums text-foreground">
            {current} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current >= totalPages}
            aria-label="หน้าถัดไป"
          >
            ถัดไป
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
