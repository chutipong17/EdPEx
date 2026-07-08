"use client";

import { useState } from "react";
import useSWR from "swr";

import type { IndicatorType } from "@/types/indicator-type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndicatorTypeTable } from "./indicator-type-table";
import { AddIndicatorTypeDialog } from "./add-indicator-type";
import { EditIndicatorTypeDialog } from "./edit-indicator-type-dialog";
import { DeleteIndicatorTypeDialog } from "./delete-indicator-type";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้");
    return res.json() as Promise<IndicatorType[]>;
  });

export function IndicatorTypeManager() {
  const { data, isLoading, mutate } = useSWR<IndicatorType[]>(
    "/api/my-indicator-types",
    fetcher,
  );
  const [editTarget, setEditTarget] = useState<IndicatorType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IndicatorType | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleEdit(indicatorType: IndicatorType) {
    setEditTarget(indicatorType);
    setEditOpen(true);
  }

  function handleDelete(indicatorType: IndicatorType) {
    setDeleteTarget(indicatorType);
    setDeleteOpen(true);
  }
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>รายการประเภทตัวชี้วัด</CardTitle>
        <AddIndicatorTypeDialog onCreated={() => mutate()} />
      </CardHeader>
      <CardContent>
        <IndicatorTypeTable
          data={data ?? []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>
      <EditIndicatorTypeDialog
        indicatorType={editTarget}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={() => mutate()}
      />
      <DeleteIndicatorTypeDialog indicatorType={deleteTarget} open={deleteOpen} onOpenChange={setDeleteOpen} onDeleted={()=>mutate()}/>
    </Card>
  );
}
