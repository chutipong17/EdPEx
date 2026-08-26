"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Target, CalendarDays, Users } from "lucide-react";

import { useGetKpi } from "@/service/kpi/kpi";
import { useGetMonth } from "@/service/month/month";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/manage/Indicators/status-badge";

interface IndicatorDetailProps {
  id: string;
}

interface Month {
  id: number;
  name: string;
  value: string;
}

interface Comparison {
  id?: number | string;
  name?: string;
  comparisonName?: string;
  result?: string | number;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>

      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-border bg-card p-5 lg:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-5 text-primary" />

        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>

      {children}
    </section>
  );
}

export function IndicatorDetail({ id }: IndicatorDetailProps) {
  // =====================================================
  // Get KPI
  // =====================================================

  const {
    data: kpiResponse,
    isLoading: kpiLoading,
    error: kpiIsError,
    error: kpiError,
  } = useGetKpi();

  // =====================================================
  // Get Month
  // =====================================================

  const {
    data: monthResponse,
    isLoading: monthLoading,
    error: monthIsError,
    error: monthError,
  } = useGetMonth();

  console.log("=================================");
  console.log("KPI RESPONSE:", kpiResponse);
  console.log("MONTH RESPONSE:", monthResponse);
  console.log("DETAIL ID:", id);
  console.log("=================================");

  // =====================================================
  // Loading
  // =====================================================

  if (kpiLoading || monthLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-[20px] bg-muted" />

          <div className="h-64 animate-pulse rounded-[20px] bg-muted" />
        </div>

        <div className="h-64 animate-pulse rounded-[20px] bg-muted" />
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (kpiIsError || monthIsError) {
    const error = kpiError || monthError;

    return (
      <div className="rounded-[20px] border border-destructive/30 bg-card p-8">
        <h1 className="text-xl font-semibold text-destructive">
          ไม่สามารถโหลดข้อมูล KPI
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดในการโหลดข้อมูล"}
        </p>

        <Button
          render={<Link href="/admin/manage/indicators" />}
          variant="outline"
          className="mt-5"
        >
          <ArrowLeft data-icon="inline-start" />
          กลับไปรายการตัวชี้วัด
        </Button>
      </div>
    );
  }

  // =====================================================
  // Get API data
  // =====================================================

  const kpis = Array.isArray(kpiResponse?.data) ? kpiResponse.data : [];

  const months = Array.isArray(monthResponse?.data) ? monthResponse.data : [];

  console.log("KPI ARRAY:", kpis);
  console.log("MONTH ARRAY:", months);

  // =====================================================
  // Find current KPI
  // =====================================================

  const indicator = kpis.find((item: any) => String(item.id) === String(id));

  console.log("CURRENT KPI:", indicator);

  // =====================================================
  // Not found
  // =====================================================

  if (!indicator) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-[20px] border border-border bg-card p-8">
          <h1 className="text-xl font-semibold">ไม่พบข้อมูลตัวชี้วัด</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            ไม่พบข้อมูล KPI ที่มี ID = {id}
          </p>
        </div>

        <Button
          render={<Link href="/admin/manage/indicators" />}
          variant="outline"
          className="w-fit"
        >
          <ArrowLeft data-icon="inline-start" />
          กลับไปรายการตัวชี้วัด
        </Button>
      </div>
    );
  }

  // =====================================================
  // Mapping API fields
  // =====================================================

  const code = indicator.kpiCode ?? indicator.code ?? "-";

  const name = indicator.kpiName ?? indicator.name ?? "-";

  const indicatorType =
    indicator.indicatorType ?? indicator.kpiCategory?.categoryName ?? "-";

  const year = indicator.year ?? "-";

  // const dataType =
  //   indicator.dataType ??
  //   "-";

  // =====================================================
  // targetCondition
  // =====================================================

  const targetCondition =
    typeof indicator.targetCondition === "object" &&
    indicator.targetCondition !== null
      ? (indicator.targetCondition.description ?? "-")
      : (indicator.targetCondition ?? "-");

  // =====================================================
  // Target
  // =====================================================

  const target = indicator.targetValue ?? "-";

  const unit = indicator.unit ?? "";

  const result = indicator.result ?? null;

  // =====================================================
  // Collection period
  // =====================================================

  const collectionPeriod = indicator.frequency?.frequencyName ?? "-";

  // =====================================================
  // Department
  // =====================================================

  const department =
    indicator.departmentName ?? indicator.department?.departmentName ?? "-";

  // =====================================================
  // Owner
  // =====================================================

  const owner =
    [indicator.firstName, indicator.lastName].filter(Boolean).join(" ") || "-";

  // =====================================================
  // Status
  // =====================================================

  const status = indicator.submission?.[0]?.status?.name ?? "Pending";

  // =====================================================
  // Comparison
  // =====================================================

  const comparisons: Comparison[] = Array.isArray(indicator.kpiComparison)
    ? indicator.kpiComparison
    : [];

  // =====================================================
  // Month of Delivery
  // =====================================================

  /**
   * API:
   *
   * "monthOfDelivery": {
   *   "id": 11,
   *   "name": "พฤศจิกายน",
   *   "value": "11"
   * }
   *
   * เก็บ value ไว้สำหรับเปรียบเทียบ
   */
  const selectedMonth = String(indicator.monthOfDelivery?.value ?? "");

  console.log("SELECTED MONTH:", selectedMonth);

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="flex flex-col gap-5">
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-semibold text-primary">
              {code}
            </span>

            <StatusBadge status={status} />
          </div>

          <h1 className="text-2xl font-semibold text-balance text-foreground">
            {name}
          </h1>

          <p className="text-sm text-muted-foreground">
            {indicatorType} · ปีข้อมูล {year}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Back */}

          <Button
            render={<Link href="/admin/manage/indicators" />}
            variant="outline"
            className="h-10"
          >
            <ArrowLeft data-icon="inline-start" />
            ย้อนกลับ
          </Button>

          {/* Edit */}

          <Button
            render={
              <Link href={`/admin/manage/indicators/edit/${indicator.id}`} />
            }
            className="h-10"
          >
            <Pencil data-icon="inline-start" />
            แก้ไข
          </Button>
        </div>
      </div>

      {/* ================================================= */}
      {/* Information */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ================================================= */}
        {/* Target */}
        {/* ================================================= */}

        <SectionCard title="ข้อมูลเป้าหมาย" icon={Target}>
          <dl className="grid grid-cols-2 gap-4">
            {/* <InfoRow
              label="ประเภทข้อมูล"
              value={dataType}
            /> */}
            <InfoRow label="ระยะเวลาการเก็บข้อมูล" value={collectionPeriod} />

            <InfoRow label="เงื่อนไขเป้าหมาย" value={targetCondition} />

            <InfoRow label="เป้าหมาย" value={`${target} ${unit}`} />

            <InfoRow
              label="ผลประเมิน"
              value={result !== null ? `${result} ${unit}` : "-"}
            />

            <InfoRow label="หน่วยนับ" value={unit || "-"} />
          </dl>
        </SectionCard>

        {/* ================================================= */}
        {/* Responsible */}
        {/* ================================================= */}

        <SectionCard title="ผู้รับผิดชอบ" icon={Users}>
          <dl className="grid grid-cols-1 gap-4">
            <InfoRow label="หน่วยงานผู้รับผิดชอบ" value={department} />

            <InfoRow label="ผู้รับผิดชอบ" value={owner} />
          </dl>

          {/* ================================================= */}
          {/* Comparison */}
          {/* ================================================= */}

          {comparisons.length > 0 && (
            <>
              <Separator className="my-4" />

              <p className="mb-3 text-sm font-medium text-foreground">
                คู่เทียบข้อมูลและผลลัพธ์
              </p>

              <ul className="flex flex-col gap-2">
                {comparisons.map((comparison, index) => (
                  <li
                    key={comparison.id ?? index}
                    className="flex items-center justify-between rounded-[10px] border border-border bg-background px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-foreground">
                      {comparison.name ?? comparison.comparisonName ?? "-"}
                    </span>

                    <span className="text-muted-foreground">
                      {comparison.result ?? "-"}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </SectionCard>
      </div>

      {/* ================================================= */}
      {/* Delivery */}
      {/* ================================================= */}

      <SectionCard title="การส่งมอบข้อมูล" icon={CalendarDays}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {months.map((month: Month) => {
            /**
             * เปรียบเทียบ
             *
             * indicator.monthOfDelivery.value
             *              ↓
             *             "11"
             *
             * month.value
             *              ↓
             *             "11"
             *
             * ถ้าตรงกัน = active
             */
            const active = String(month.value) === selectedMonth;

            return (
              <div
                key={month.id}
                className={
                  active
                    ? "rounded-[10px] border border-primary bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground"
                    : "rounded-[10px] border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground"
                }
              >
                {month.name}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
