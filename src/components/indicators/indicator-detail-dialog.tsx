// 'use client'

// import type { Indicator } from '@/types/indicator-Edpx'
// import { ResultForm } from '@/components/indicators/result-form'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'

// interface InfoRow {
//   label: string
//   value: string
// }

// function InfoCard({ indicator }: { indicator: Indicator }) {
//   const rows: InfoRow[] = [
//     { label: 'ตัวชี้วัด EdPEx', value: indicator.kpiName },
//     // { label: 'ตัวชี้วัดกลยุทธ์', value: indicator.strategicIndicator },
//     // { label: 'ตัวชี้วัด OKRs', value: indicator.okrsIndicator },
//     { label: 'ตัวชี้วัด', value: indicator.name },
//     // { label: 'เวลาส่งมอบ', value: indicator.months },
//     { label: 'เป้าหมาย', value: `${indicator.target} ${indicator.unit}` },
//   ]

//   return (
//     <div className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-2xl border border-border bg-muted/40 p-5 sm:grid-cols-2">
//       {rows.map((row) => (
//         <div key={row.label} className="flex flex-col gap-1">
//           <dt className="text-xs font-medium text-muted-foreground">
//             {row.label}
//           </dt>
//           <dd className="text-sm font-medium text-foreground text-pretty">
//             {row.value}
//           </dd>
//         </div>
//       ))}
//     </div>
//   )
// }

// function SectionTitle({ children }: { children: React.ReactNode }) {
//   return (
//     <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
//       <span className="h-5 w-1 rounded-full bg-primary" aria-hidden="true" />
//       {children}
//     </h3>
//   )
// }

// export function IndicatorDetailDialog({
//   indicator,
//   open,
//   mode,
//   onOpenChange,
// }: {
//   indicator: Indicator | null
//   open: boolean
//   mode: 'view' | 'edit'
//   onOpenChange: (open: boolean) => void
// }) {
//   if (!indicator) return null

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-h-[90svh] gap-6 overflow-y-auto rounded-3xl sm:max-w-[1200px]">
//         <DialogHeader>
//           <DialogTitle className="text-xl text-foreground">
//             {indicator.code} — {indicator.name}
//           </DialogTitle>
//           <DialogDescription>
//             ปีข้อมูล {indicator.dataYear} · {indicator.department}
//           </DialogDescription>
//         </DialogHeader>

//         {/* Section 1: ข้อมูลตัวชี้วัด */}
//         <section className="flex flex-col gap-3">
//           <SectionTitle>ข้อมูลตัวชี้วัด</SectionTitle>
//           <InfoCard indicator={indicator} />
//         </section>

//         {/* Section 2: บันทึกผล */}
//         <section className="flex flex-col gap-3">
//           <SectionTitle>บันทึกผล</SectionTitle>
//           {mode === 'edit' ? (
//             <ResultForm
//               indicator={indicator}
//               onSuccess={() => onOpenChange(false)}
//             />
//           ) : (
//             <div className="rounded-2xl border border-border bg-card p-5">
//               <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                 <div className="flex flex-col gap-1">
//                   <dt className="text-xs font-medium text-muted-foreground">
//                     เวลาส่งมอบ
//                   </dt>
//                   <dd className="text-sm font-medium text-foreground">
//                     {indicator.deliveryTime}
//                   </dd>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <dt className="text-xs font-medium text-muted-foreground">
//                     เป้าหมาย
//                   </dt>
//                   <dd className="text-sm font-medium text-foreground">
//                     {indicator.target} {indicator.unit}
//                   </dd>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <dt className="text-xs font-medium text-muted-foreground">
//                     ผลประเมิน
//                   </dt>
//                   <dd className="text-sm font-semibold text-foreground">
//                     {indicator.resultValue !== null
//                       ? `${indicator.resultValue} ${indicator.unit}`
//                       : 'ยังไม่มีผล'}
//                   </dd>
//                 </div>
//               </dl>
//             </div>
//           )}
//         </section>
//       </DialogContent>
//     </Dialog>
//   )
// }
"use client";

import type { Indicator, KpiSubmission } from "@/types/indicator-Edpx";
import { ResultForm } from "@/components/indicators/result-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InfoRow {
  label: string;
  value: string;
}

function InfoCard({ indicator }: { indicator: Indicator }) {
  const rows: InfoRow[] = [
    {
      label: indicator.kpiCategory.categoryName,
      value: indicator.kpiName ?? "-",
    },
    {
      label: "ตัวชี้วัด",
      value: indicator.name ?? "-",
    },
    {
      label: "เป้าหมาย",
      value: `${indicator.target ?? "-"} ${indicator.unit ?? ""}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-2xl border border-border bg-muted/40 p-5 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1">
          <dt className="text-xs font-medium text-muted-foreground">
            {row.label}
          </dt>

          <dd className="text-sm font-medium text-foreground text-pretty">
            {row.value}
          </dd>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
      <span className="h-5 w-1 rounded-full bg-primary" aria-hidden="true" />

      {children}
    </h3>
  );
}

function getLatestSubmission(indicator: Indicator): KpiSubmission | null {
  const submissions =
    indicator.submission?.length > 0
      ? indicator.submission
      : indicator.kpiAssignment?.length > 0
        ? indicator.kpiAssignment
        : [];

  if (submissions.length === 0) {
    return null;
  }

  return [...submissions].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  })[0];
}

export function IndicatorDetailDialog({
  indicator,
  open,
  mode,
  onOpenChange,
}: {
  indicator: Indicator | null;
  open: boolean;
  mode: "view" | "edit";
  onOpenChange: (open: boolean) => void;
}) {
  if (!indicator) return null;

  const latestSubmission = getLatestSubmission(indicator);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] gap-6 overflow-y-auto rounded-3xl sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            {indicator.code} — {indicator.name}
          </DialogTitle>

          <DialogDescription>
            ปีข้อมูล {indicator.year} ·{" "}
            {indicator.departmentName || indicator.department || "-"}
          </DialogDescription>
        </DialogHeader>

        {/* Section 1: ข้อมูลตัวชี้วัด */}
        <section className="flex flex-col gap-3">
          <SectionTitle>ข้อมูลตัวชี้วัด</SectionTitle>

          <InfoCard indicator={indicator} />
        </section>

        {/* Section 2: บันทึกผล */}
        <section className="flex flex-col gap-3">
          <SectionTitle>บันทึกผล</SectionTitle>

          {mode === "edit" ? (
            <ResultForm
              indicator={indicator}
              onSuccess={() => onOpenChange(false)}
            />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-5">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* เวลาส่งมอบ */}
                <div className="flex flex-col gap-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    รอบการเก็บข้อมูล
                  </dt>

                  <dd className="text-sm font-medium text-foreground">
                    {indicator.collectionPeriod || "-"}
                  </dd>
                </div>

                {/* เป้าหมาย */}
                <div className="flex flex-col gap-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    เป้าหมาย
                  </dt>

                  <dd className="text-sm font-medium text-foreground">
                    {indicator.target ?? "-"} {indicator.unit ?? ""}
                  </dd>
                </div>

                {/* ผลประเมิน */}
                <div className="flex flex-col gap-1">
                  <dt className="text-xs font-medium text-muted-foreground">
                    ผลประเมิน
                  </dt>

                  <dd className="text-sm font-semibold text-foreground">
                    {latestSubmission?.kpiSubmission?.[0]?.actualValue != null
                      ? `${latestSubmission.kpiSubmission[0].actualValue} ${
                          indicator.unit ?? ""
                        }`
                      : "ยังไม่มีผล"}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
