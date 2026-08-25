"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus, FileSpreadsheet, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IndicatorTable , type SortKey } from "./indicator-table"
import { TablePagination } from "./table-pagination"
import type { Indicator } from "@/types/indicator-Edpx"
import { useGetKpi } from "@/service/kpi/kpi"
const PAGE_SIZE_OPTIONS = ["10", "25", "50", "100"]

export function IndicatorList() {
  const [search, setSearch] = useState("")
  const [pageSize, setPageSize] = useState("10")
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
const {
  data: kpiResponse,
  isLoading,
  error,
} = useGetKpi();

console.log("kpiResponse", kpiResponse);

const filtered = useMemo(() => {
  const term = search.trim().toLowerCase();

  // ป้องกัน data ไม่ใช่ array
  let result = Array.isArray(kpiResponse?.data)
    ? kpiResponse.data
    : [];

  if (term) {
    result = result.filter((i: any) =>
      String(i.kpiName ?? "").toLowerCase().includes(term) ||
      String(i.kpiCode ?? "").toLowerCase().includes(term) ||
      String(i.departmentName ?? "").toLowerCase().includes(term) ||
      String(i.owner ?? "").toLowerCase().includes(term) ||
      String(i.indicatorType ?? "").toLowerCase().includes(term)
    );
  }

  if (sortKey) {
    result = [...result].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (av == null) return 1;
      if (bv == null) return -1;

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc"
          ? av - bv
          : bv - av;
      }

      return sortDir === "asc"
        ? String(av).localeCompare(String(bv), "th")
        : String(bv).localeCompare(String(av), "th");
    });
  }

  return result;
}, [kpiResponse, search, sortKey, sortDir]);

const size = Number(pageSize);

const totalPages = Math.max(
  1,
  Math.ceil(filtered.length / size)
);

const currentPage = Math.min(page, totalPages);

const paged = filtered.slice(
  (currentPage - 1) * size,
  currentPage * size
);

function handleSort(key: SortKey) {
  if (sortKey === key) {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  } else {
    setSortKey(key);
    setSortDir("asc");
  }
}

  return (
    <div className="flex flex-col gap-5">
      {/* Page title + action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">ตัวชี้วัด</h1>
          <p className="text-sm text-muted-foreground">
            จัดการรายการตัวชี้วัด (KPI) ทั้งหมดในระบบ
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            render={<Link href="/admin/manage/indicators/create" />}
            variant="outline"
            className="h-10 border-info/40 text-info hover:bg-info/10 hover:text-info"
          >
            <Plus data-icon="inline-start" />
            เพิ่มตัวชี้วัด
          </Button>
          {/* <Button
            variant="outline"
            className="h-10 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
            onClick={() => toast.success("กำลังส่งออกข้อมูลเป็นไฟล์ Excel")}
          >
            <FileSpreadsheet data-icon="inline-start" />
            Export Excel
          </Button> */}
        </div>
      </div>

      {/* Search area */}
      <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex w-full flex-col gap-1.5 sm:max-w-sm">
          <label
            htmlFor="indicator-search"
            className="text-sm font-medium text-foreground"
          >
            ค้นหาข้อมูล
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="indicator-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="ค้นหาชื่อรายการ..."
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="page-size" className="text-sm font-medium text-foreground">
            จำนวนรายการ
          </label>
          <Select
            value={pageSize}
            onValueChange={(v) => {
              setPageSize(v as string)
              setPage(1)
            }}
          >
            <SelectTrigger id="page-size" className="h-10 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt} รายการ
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <IndicatorTable
        data={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={size}
        onPageChange={setPage}
      />
    </div>
  )
}
