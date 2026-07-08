"use client"

import Link from "next/link"
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, Pencil } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import type { Indicator } from "@/types/indicator-Edpx"

type SortKey = keyof Pick<
  Indicator,
  "year" | "indicatorType" | "code" | "name" | "department" | "owner" | "target" | "result"
>

interface Column {
  key: SortKey | "unit" | "dataType" | "status" | "actions"
  label: string
  sortable?: boolean
  className?: string
}

const columns: Column[] = [
  { key: "year", label: "ปีข้อมูล", sortable: true },
  { key: "indicatorType", label: "ประเภทตัวชี้วัด", sortable: true },
  { key: "code", label: "รหัสตัวชี้วัด", sortable: true },
  { key: "name", label: "ชื่อตัวชี้วัด", sortable: true, className: "min-w-[240px] whitespace-normal" },
  { key: "department", label: "หน่วยงานที่รับผิดชอบ", sortable: true, className: "min-w-[180px] whitespace-normal" },
  { key: "owner", label: "ผู้รับผิดชอบ", sortable: true, className: "min-w-[160px] whitespace-normal" },
  { key: "dataType", label: "ประเภทข้อมูล" },
  { key: "target", label: "เป้าหมาย", sortable: true, className: "text-right" },
  { key: "unit", label: "หน่วยนับ" },
  { key: "result", label: "ผลประเมิน", sortable: true, className: "text-right" },
  { key: "status", label: "สถานะ" },
  { key: "actions", label: "จัดการ", className: "text-center" },
]

interface IndicatorTableProps {
  data: Indicator[]
  sortKey: SortKey | null
  sortDir: "asc" | "desc"
  onSort: (key: SortKey) => void
}

export function IndicatorTable({ data, sortKey, sortDir, onSort }: IndicatorTableProps) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-card">
      <div className="max-h-[60vh] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-muted">
              {columns.map((col) => {
                const isSorted = col.sortable && sortKey === col.key
                return (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "h-12 bg-muted text-xs font-semibold text-foreground",
                      col.className,
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key as SortKey)}
                        className="inline-flex items-center gap-1 rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {col.label}
                        {isSorted ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : (
                            <ArrowDown className="size-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3.5 text-muted-foreground" />
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-10 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลตัวชี้วัด
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="text-sm">
                  <TableCell className="font-medium">{item.year}</TableCell>
                  <TableCell className="whitespace-normal">{item.indicatorType}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-medium text-primary">
                      {item.code}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-[240px] whitespace-normal font-medium text-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell className="min-w-[180px] whitespace-normal text-muted-foreground">
                    {item.department}
                  </TableCell>
                  <TableCell className="min-w-[160px] whitespace-normal text-muted-foreground">
                    {item.owner}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.dataType}</TableCell>
                  <TableCell className="text-right font-medium">{item.target}</TableCell>
                  <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {item.result ?? "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        render={<Link href={`/admin/manage/indicators/${item.id}`} />}
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        className="h-8 border-info/40 text-info hover:bg-info/10 hover:text-info"
                      >
                        <Eye data-icon="inline-start" />
                        ดูรายละเอียด
                      </Button>
                      <Button
                       nativeButton={false}
                        render={<Link href={`/admin/manage/indicators/edit/${item.id}`} />}
                        variant="outline"
                        size="sm"
                        className="h-8 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
                      >
                        <Pencil data-icon="inline-start" />
                        แก้ไข
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export type { SortKey }
