"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Pencil,
  Search,
} from "lucide-react";

import type {
  Indicator,
  IndicatorStatus,
  IndicatorStatusKpiSubmission,
  KpiSubmission,
} from "@/types/indicator-Edpx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusBadge } from "@/components/indicators/status-badge";
import { IndicatorDetailDialog } from "@/components/indicators/indicator-detail-dialog";

/* =========================================================
   Helper
========================================================= */

/**
 * หา submission ล่าสุด
 */
// function getLatestSubmission(
//   indicator: Indicator,
// ): KpiSubmission | null {
//   const submissions = [
//     ...(indicator.submission ?? []),
//     ...(indicator.kpiAssignment ?? []),
//   ];

//   if (submissions.length === 0) {
//     return null;
//   }

//   return [...submissions].sort((a, b) => {
//     const dateA = a.submittedDate
//       ? new Date(a.submittedDate).getTime()
//       : 0;

//     const dateB = b.submittedDate
//       ? new Date(b.submittedDate).getTime()
//       : 0;

//     return dateB - dateA;
//   })[0];
// }

export function getLatestSubmission(
  indicator: Indicator,
): KpiSubmission | undefined {
  const submissions =
    indicator.kpiAssignment?.flatMap(
      (assignment) => assignment.kpiSubmission ?? [],
    ) ?? [];

  if (submissions.length === 0) {
    return undefined;
  }

  return [...submissions].sort((a, b) => {
    const dateA = a.submittedDate ? new Date(a.submittedDate).getTime() : 0;

    const dateB = b.submittedDate ? new Date(b.submittedDate).getTime() : 0;

    return dateB - dateA;
  })[0];
}
/**
 * แปลง status จาก API
 *
 * API status เป็น string เช่น
 * ผ่าน / รอส่ง / ไม่ผ่าน
 *
 * แต่ StatusBadge ต้องการ
 * success | warning | danger
 */
function getIndicatorStatus(
  indicator: Indicator,
): IndicatorStatusKpiSubmission {
  const submission = getLatestSubmission(indicator);

  console.log("Submission =====", submission);

  console.log("Status =====", submission?.status?.name);

  if (!submission) {
    return "Pending";
  }

  const statusName = submission.status?.name?.trim().toLowerCase() ?? "";

  if (
    statusName.includes("submitted") ||
    statusName.includes("ส่งแล้ว") ||
    statusName.includes("ส่งข้อมูล") ||
    statusName.includes("ผ่าน") ||
    statusName.includes("สำเร็จ") ||
    statusName.includes("อนุมัติ") ||
    statusName.includes("approved") ||
    statusName.includes("success") ||
    statusName.includes("complete")
  ) {
    return "Submitted";
  }

  return "Pending";
}
/**
 * ผลประเมินจาก API
 */
function getResultValue(indicator: Indicator): string {
  const submission = getLatestSubmission(indicator);

  console.log("Submission indicator ====", submission);

  if (!submission) {
    return "-";
  }

  const kpiSubmission = submission;

  console.log("KPI Submission ====", kpiSubmission);

  if (!kpiSubmission) {
    return "-";
  }

  if (
    kpiSubmission.actualValue !== null &&
    kpiSubmission.actualValue !== undefined
  ) {
    return kpiSubmission.actualValue;
  }

  if (
    kpiSubmission.achievementPercent !== null &&
    kpiSubmission.achievementPercent !== undefined
  ) {
    return `${kpiSubmission.achievementPercent}%`;
  }

  if (
    kpiSubmission.calculatedScore !== null &&
    kpiSubmission.calculatedScore !== undefined
  ) {
    return kpiSubmission.calculatedScore;
  }

  return "-";
}
/**
 * ผู้รับผิดชอบ
 */
function getOwner(indicator: Indicator): string {
  return (
    [indicator.firstName, indicator.lastName].filter(Boolean).join(" ") || "-"
  );
}

/**
 * Escape CSV
 */
function escapeCsv(value: unknown): string {
  return `"${String(value ?? "-").replace(/"/g, '""')}"`;
}

/**
 * Export CSV
 */
function exportToCsv(rows: Indicator[]) {
  const headers = [
    "ปีข้อมูล",
    "ประเภทตัวชี้วัด",
    "รหัสตัวชี้วัด",
    "ชื่อตัวชี้วัด",
    "หน่วยงานที่รับผิดชอบ",
    "ผู้รับผิดชอบ",
    "เป้าหมาย",
    "หน่วยนับ",
    "ผลประเมิน",
    "สถานะ",
  ];

  const lines = rows.map((item) => {
    const status = getIndicatorStatus(item);

    return [
      item.year,
      item.kpiCategory?.categoryName ?? "-",
      item.kpiCode ?? "-",
      item.kpiName ?? "-",
      item.departmentName ?? "-",
      getOwner(item),
      item.targetValue ?? "-",
      item.unit ?? "-",
      getResultValue(item),
      status,
    ]
      .map(escapeCsv)
      .join(",");
  });

  const csv =
    "\uFEFF" + [headers.map(escapeCsv).join(","), ...lines].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = `edpex-indicators-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/* =========================================================
   Component
========================================================= */

export function IndicatorTable({ indicators }: { indicators: Indicator[] }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);

  const [selected, setSelected] = useState<Indicator | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [mode, setMode] = useState<"view" | "edit">("view");

  /* =====================================================
     Dialog
  ===================================================== */

  const openDialog = (indicator: Indicator, dialogMode: "view" | "edit") => {
    setSelected(indicator);
    setMode(dialogMode);
    setDialogOpen(true);
  };

  /* =====================================================
     Columns
  ===================================================== */

  const columns = useMemo<ColumnDef<Indicator>[]>(
    () => [
      {
        accessorKey: "year",

        header: "ปีข้อมูล",
      },

      {
        id: "category",

        accessorFn: (row) => row.kpiCategory?.categoryName ?? "-",

        header: "ประเภทตัวชี้วัด",
      },

      {
        accessorKey: "kpiCode",

        header: "รหัสตัวชี้วัด",

        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium text-primary">
            {row.original.kpiCode || "-"}
          </span>
        ),
      },

      {
        accessorKey: "kpiName",

        header: "ชื่อตัวชี้วัด",

        cell: ({ row }) => (
          <span className="block min-w-[280px] max-w-[360px] whitespace-normal text-pretty text-center">
            {row.original.kpiName || "-"}
          </span>
        ),
      },

      {
        accessorKey: "departmentName",

        header: "หน่วยงานที่รับผิดชอบ",

        cell: ({ row }) => (
          <span className="block min-w-[180px] whitespace-normal text-center">
            {row.original.departmentName || "-"}
          </span>
        ),
      },

      {
        id: "owner",

        accessorFn: (row) => getOwner(row),

        header: "ผู้รับผิดชอบ",

        cell: ({ row }) => (
          <span className="block min-w-[160px] whitespace-normal text-center">
            {getOwner(row.original)}
          </span>
        ),
      },

      {
        accessorKey: "targetValue",

        header: "เป้าหมาย",

        cell: ({ row }) => (
          <span className="font-medium text-center">
            {row.original.targetValue ?? "-"}
          </span>
        ),
      },

      {
        accessorKey: "unit",

        header: "หน่วยนับ",

        cell: ({ row }) => (
          <span className="text-muted-foreground text-center">
            {row.original.unit || "-"}
          </span>
        ),
      },

      {
        id: "result",

        accessorFn: (row) => getResultValue(row),

        header: "ผลประเมิน",

        cell: ({ row }) => {
          const result = getResultValue(row.original);

          return result === "-" ? (
            <span className="text-muted-foreground text-center">-</span>
          ) : (
            <span className="font-semibold">{result}</span>
          );
        },
      },

      {
        id: "status",

        accessorFn: (row) => getIndicatorStatus(row),

        header: "สถานะ",

        enableSorting: false,

        cell: ({ row }) => (
          <StatusBadge status={getIndicatorStatus(row.original)} />
        ),
      },

      {
        id: "actions",

        header: "จัดการ",

        enableSorting: false,
        cell: ({ row }) => {
          const status = getIndicatorStatus(row.original);

          return (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openDialog(row.original, "view")}
                className="h-8 gap-1.5 border-info/40 text-info hover:bg-info/10 hover:text-info"
              >
                <Eye className="size-4" aria-hidden="true" />
                ผลลัพธ์
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={status === "Submitted"}
                onClick={() => openDialog(row.original, "edit")}
                className="h-8 gap-1.5 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil className="size-4" aria-hidden="true" />
                เพิ่ม
              </Button>
            </div>
          );
        },
        // cell: ({ row }) => (

        //   <div className="flex items-center justify-center gap-2">

        //     <Button
        //       size="sm"
        //       variant="outline"
        //       onClick={() =>
        //         openDialog(
        //           row.original,
        //           "view",
        //         )
        //       }
        //       className="h-8 gap-1.5 border-info/40 text-info hover:bg-info/10 hover:text-info"
        //     >
        //       <Eye
        //         className="size-4"
        //         aria-hidden="true"
        //       />

        //       ผลลัพธ์
        //     </Button>
        //     {/* {status = Submitted disable} */}
        //     <Button
        //       size="sm"
        //       variant="outline"
        //       onClick={() =>
        //         openDialog(
        //           row.original,
        //           "edit",
        //         )
        //       }
        //       className="h-8 gap-1.5 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
        //     >
        //       <Pencil
        //         className="size-4"
        //         aria-hidden="true"
        //       />

        //       เพิ่ม
        //     </Button>

        //   </div>
        // ),
      },
    ],
    [],
  );

  /* =====================================================
     React Table
  ===================================================== */

  const table = useReactTable({
    data: indicators ?? [],

    columns,

    state: {
      globalFilter,
      sorting,
    },

    onGlobalFilterChange: setGlobalFilter,

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  /* =====================================================
     Filtered rows
  ===================================================== */

  const filteredRows = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);

  /* =====================================================
     Render
  ===================================================== */

  return (
    <div className="flex flex-col gap-4">
      {/* =================================================
          Toolbar
      ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="ค้นหาตัวชี้วัด..."
            className="pl-9"
          />
        </div>

        {/* <Button
          variant="outline"
          onClick={() =>
            exportToCsv(
              filteredRows,
            )
          }
          className="gap-2 border-warning/50 text-warning hover:bg-warning/10 hover:text-warning"
        >
          <FileSpreadsheet
            className="size-4"
          />

          Export Excel
        </Button> */}
      </div>

      {/* =================================================
          Desktop / Tablet
      ================================================= */}

      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();

                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap text-center text-xs font-semibold text-foreground"
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 rounded-md transition-colors hover:text-primary"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          <ArrowUpDown className="size-3.5" />
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-10 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลตัวชี้วัด
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="text-sm transition-colors hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* =================================================
          Mobile
      ================================================= */}

      <div className="flex flex-col gap-3 md:hidden">
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => {
            const item = row.original;

            return (
              <div
                key={row.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.kpiCode || "-"}
                    </p>

                    <p className="text-sm font-medium text-foreground">
                      {item.kpiName || "-"}
                    </p>
                  </div>

                  <StatusBadge status={getIndicatorStatus(item)} />
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-muted-foreground">ปีข้อมูล</dt>

                    <dd>{item.year || "-"}</dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">ประเภท</dt>

                    <dd>{item.kpiCategory?.categoryName || "-"}</dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">หน่วยงาน</dt>

                    <dd>{item.departmentName || "-"}</dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">ผู้รับผิดชอบ</dt>

                    <dd>{getOwner(item)}</dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">เป้าหมาย</dt>

                    <dd>
                      {item.targetValue ?? "-"} {item.unit || ""}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">ผลประเมิน</dt>

                    <dd>{getResultValue(item)}</dd>
                  </div>
                </dl>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(item, "view")}
                    className="flex-1 gap-1.5 border-info/40 text-info hover:bg-info/10 hover:text-info"
                  >
                    <Eye className="size-4" />
                    ผลลัพธ์
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(item, "edit")}
                    className="flex-1 gap-1.5 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
                  >
                    <Pencil className="size-4" />
                    เพิ่ม
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            ไม่พบข้อมูลตัวชี้วัด
          </p>
        )}
      </div>

      {/* =================================================
          Pagination
      ================================================= */}

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          แสดง {table.getRowModel().rows.length} จาก{" "}
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
            <ChevronLeft className="size-4" />
            ก่อนหน้า
          </Button>

          <span className="text-sm text-muted-foreground">
            หน้า {table.getState().pagination.pageIndex + 1} /{" "}
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
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* =================================================
          Dialog
      ================================================= */}

      <IndicatorDetailDialog
        indicator={selected}
        open={dialogOpen}
        mode={mode}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
