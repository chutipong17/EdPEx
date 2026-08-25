"use client";

import Link from "next/link";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import type { Indicator } from "@/types/indicator-Edpx";
import { useState } from "react";
import { useDeleteKpi } from "@/service/kpi/kpi";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SortKey = keyof Pick<
  Indicator,
  | "year"
  | "indicatorType"
  | "code"
  | "name"
  | "department"
  | "owner"
  | "target"
  | "result"
>;

interface Column {
  key: SortKey | "unit" | "dataType" | "status" | "actions";
  label: string;
  sortable?: boolean;
  className?: string;
}

const columns: Column[] = [
  { key: "year", label: "ปีข้อมูล", sortable: true },
  { key: "indicatorType", label: "ประเภทตัวชี้วัด", sortable: true },
  { key: "code", label: "รหัสตัวชี้วัด", sortable: true },
  {
    key: "name",
    label: "ชื่อตัวชี้วัด",
    sortable: true,
    className: "min-w-[240px] whitespace-normal",
  },
  {
    key: "department",
    label: "หน่วยงานที่รับผิดชอบ",
    sortable: true,
    className: "min-w-[180px] whitespace-normal",
  },
  {
    key: "owner",
    label: "ผู้รับผิดชอบ",
    sortable: true,
    className: "min-w-[160px] whitespace-normal",
  },
  { key: "target", label: "เป้าหมาย", sortable: true, className: "text-right" },
  { key: "unit", label: "หน่วยนับ" },
  {
    key: "result",
    label: "ผลประเมิน",
    sortable: true,
    className: "text-right",
  },
  { key: "status", label: "สถานะ" },
  { key: "actions", label: "จัดการ", className: "text-center" },
];

interface IndicatorTableProps {
  data: Indicator[];
  sortKey: SortKey | null;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}

export function IndicatorTable({
  data,
  sortKey,
  sortDir,
  onSort,
}: IndicatorTableProps) {
  const { mutateAsync: deleteKpi } = useDeleteKpi();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const handleDeleteClick = (item: Indicator) => {
    setDeleteId(item.id);
    setDeleteName(item.kpiName);
  };
  console.log("data KPI Table ====", data);
  const handleConfirmDelete = async () => {
    if (deleteId === null) return;

    try {
      await toast.promise(
        deleteKpi({
          id: deleteId,
        }),
        {
          loading: "กำลังลบข้อมูล...",
          success: "ลบตัวชี้วัดสำเร็จ",
          error: "ไม่สามารถลบตัวชี้วัดได้",
        },
      );

      setDeleteId(null);
      setDeleteName("");
    } catch (error) {
      console.error("Delete KPI error:", error);
    }
  };
  console.log("ตัวชี้วัดด ====");

  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-card">
      <div className="max-h-[60vh] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-muted">
              {columns.map((col) => {
                const isSorted = col.sortable && sortKey === col.key;
                return (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "h-12 bg-muted text-xs font-semibold text-foreground text-center",
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
                );
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
                <TableRow key={item.id} className="text-sm ">
                  <TableCell className="font-medium">{item.year}</TableCell>
                  <TableCell className="whitespace-normal">
                    {item.kpiCategory.categoryName}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-medium text-primary">
                      {item.kpiCode}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-[300px] whitespace-normal font-normal text-foreground">
                    {item.kpiName}
                  </TableCell>
                  <TableCell className="min-w-[180px] whitespace-normal text-muted-foreground text-center">
                    {item.departmentName}
                  </TableCell>
                  <TableCell className="min-w-[160px] whitespace-normal text-muted-foreground text-center">
                    {item.firstName} {item.lastName}
                  </TableCell>
                  <TableCell className="text-right font-medium text-center">
                    {item.targetValue}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.unit}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-center">
                    {item.kpiAssignment
                      ?.flatMap((assignment) => assignment.kpiSubmission ?? [])
                      .find((submission) => !submission.isDeleted)
                      ?.actualValue ?? "-"}
                    {/* {item.submission.kpiSubmission.actualValue  ?? "-"} */}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        item.kpiAssignment?.[0]?.kpiSubmission?.[0]?.status
                          ?.name ?? "Pending"
                      }
                      // status={item.submission?.[0]?.status?.name ?? "Pending"}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        render={
                          <Link href={`/admin/manage/indicators/${item.id}`} />
                        }
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
                        render={
                          <Link
                            href={`/admin/manage/indicators/edit/${item.id}`}
                          />
                        }
                        variant="outline"
                        size="sm"
                        className="h-8 border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
                      >
                        <Pencil data-icon="inline-start" />
                        แก้ไข
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(item)}
                        className="h-8 border-danger/40 text-danger hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash data-icon="inline-start" />
                        ลบ
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <AlertDialog
          open={deleteId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteId(null);
              setDeleteName("");
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยืนยันการลบตัวชี้วัด?</AlertDialogTitle>

              <AlertDialogDescription>
                คุณต้องการลบตัวชี้วัด
                <span className="font-semibold text-foreground">
                  {" "}
                  {deleteName}
                </span>{" "}
                ใช่หรือไม่?
                <br />
                การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>

              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-danger text-danger-foreground hover:bg-danger/90"
              >
                ยืนยันการลบ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export type { SortKey };
