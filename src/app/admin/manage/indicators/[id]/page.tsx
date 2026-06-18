import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Target, CalendarDays, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/manage/Indicators/status-badge";
import { getIndicatorById } from "@/lib/mock-indicators";
import { MONTHS } from "@/types/indicator-Edpx";
import { IndicatorLayout } from "@/components/manage/Indicators/indicator-layout";
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
  icon: React.ComponentType<{ className?: string }>;
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

export default async function IndicatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const indicator = getIndicatorById(id);

  if (!indicator) {
    notFound();
  }

  const activeCollectors = indicator.collectors.filter((c) => c.name);

  return (
    <IndicatorLayout>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-semibold text-primary">
                {indicator.code}
              </span>
              <StatusBadge status={indicator.status} />
            </div>
            <h1 className="text-2xl font-semibold text-balance text-foreground">
              {indicator.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {indicator.indicatorType} · ปีข้อมูล {indicator.year}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              render={<Link href="/admin/manage/indicators" />}
              variant="outline"
              className="h-10"
            >
              <ArrowLeft data-icon="inline-start" />
              ย้อนกลับ
            </Button>
            <Button
              render={<Link href={`/admin/manage/indicators/edit/${indicator.id}`} />}
              className="h-10"
            >
              <Pencil data-icon="inline-start" />
              แก้ไข
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionCard title="ข้อมูลเป้าหมาย" icon={Target}>
            <dl className="grid grid-cols-2 gap-4">
              <InfoRow label="ประเภทข้อมูล" value={indicator.dataType} />
              <InfoRow
                label="เงื่อนไขเป้าหมาย"
                value={indicator.targetCondition}
              />
              <InfoRow
                label="เป้าหมาย"
                value={`${indicator.target} ${indicator.unit}`}
              />
              <InfoRow
                label="ผลประเมิน"
                value={
                  indicator.result != null
                    ? `${indicator.result} ${indicator.unit}`
                    : "-"
                }
              />
              <InfoRow label="หน่วยนับ" value={indicator.unit} />
              <InfoRow
                label="ระยะเวลาการเก็บข้อมูล"
                value={indicator.collectionPeriod}
              />
            </dl>
          </SectionCard>

          <SectionCard title="ผู้รับผิดชอบ" icon={Users}>
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow
                label="หน่วยงานผู้รับผิดชอบ"
                value={indicator.department}
              />
              <InfoRow label="ผู้รับผิดชอบ" value={indicator.owner} />
            </dl>
            {activeCollectors.length > 0 && (
              <>
                <Separator className="my-4" />
                <p className="mb-3 text-sm font-medium text-foreground">
                  ผู้เก็บข้อมูลและผลลัพธ์
                </p>
                <ul className="flex flex-col gap-2">
                  {activeCollectors.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-[10px] border border-border bg-background px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-foreground">
                        {c.name}
                      </span>
                      <span className="text-muted-foreground">{c.result}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </SectionCard>
        </div>

        <SectionCard title="การส่งมอบข้อมูล" icon={CalendarDays}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {MONTHS.map((month) => {
              const active = indicator.months.includes(month);
              return (
                <div
                  key={month}
                  className={
                    active
                      ? "rounded-[10px] border border-primary bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground"
                      : "rounded-[10px] border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground"
                  }
                >
                  {month}
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </IndicatorLayout>
  );
}
