import type {
  Indicator,
  IndicatorStatus,
  AnalysisDatum,
  PieDatum,
  FilterOption,
} from "@/types/dashboard";

/* =====================================================
   API KPI Type
===================================================== */

export interface KpiApi {
  id?: number;

  kpiCategoryId?: number;
  monthOfDeliveryId?: number;
  frequencyId?: number;
  targetConditionId?: number;

  departmentId?: number;
  departmentName?: string;

  userId?: number;
  firstName?: string;
  lastName?: string;

  kpiCode?: string;
  kpiName?: string;

  description?: string | null;

  targetValue?: string | number | null;

  unit?: string | null;

  year?: number | string;

  remark?: string | null;

  kpiSubmissionStatus?: string | null;

  kpiCategory?: {
    id?: number;
    categoryName?: string;
    isDeleted?: boolean;
  } | null;

  frequency?: {
    id?: number;
    frequencyName?: string;
    isDeleted?: boolean;
  } | null;

  monthOfDelivery?: {
    id?: number;
    name?: string;
    value?: string;
  } | null;

  targetCondition?: {
    id?: number;
    conditionName?: string;
    description?: string;
  } | null;

  kpiComparison?: KpiComparison[];

  kpiAssignment?: any[];

  kpiTarget?: any[];
}

/* =====================================================
   KPI Comparison
===================================================== */

export interface KpiComparison {
  id?: number;
  kpiId?: number;
  seq?: number;
  name?: string | null;
  result?: string | number | null;
  isDeleted?: boolean;
}

/* =====================================================
   Number Helper
===================================================== */

function toNumber(
  value: unknown,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isNaN(number)
    ? null
    : number;
}

/* =====================================================
   Status
===================================================== */

function mapKpiStatus(
  status: unknown,
): IndicatorStatus {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();

  if (
    value === "submitted" ||
    value === "ส่งแล้ว" ||
    value === "ส่งข้อมูลแล้ว" ||
    value === "submit"
  ) {
    return "Submitted";
  }

  if (
    value === "warning" ||
    value === "รอส่ง" ||
    value === "รอดำเนินการ" ||
    value === "ยังไม่ส่ง"
  ) {
    return "warning";
  }

  return "Pending";
}
/* =====================================================
   Get KPI Result
===================================================== */

export function getKpiResult(
  kpi: KpiApi,
): number | null {
  if (
    !Array.isArray(
      kpi?.kpiComparison,
    )
  ) {
    return null;
  }

  const comparisons =
    kpi.kpiComparison
      .filter(
        (item) =>
          item &&
          !item.isDeleted,
      )
      .sort(
        (a, b) =>
          Number(a?.seq ?? 0) -
          Number(b?.seq ?? 0),
      );

  if (
    comparisons.length === 0
  ) {
    return null;
  }

  /*
   * ใช้ Comparison ตัวสุดท้าย
   * เป็นผลประเมินล่าสุด
   */

  const latest =
    comparisons[
      comparisons.length - 1
    ];

  return toNumber(
    latest?.result,
  );
}

/* =====================================================
   Owner
===================================================== */

export function getKpiOwner(
  kpi: KpiApi,
): string {
  const name = [
    kpi?.firstName,
    kpi?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "-";
}

/* =====================================================
   Department
===================================================== */

export function getKpiDepartment(
  kpi: KpiApi,
): string {
  return (
    kpi?.departmentName ||
    "-"
  );
}

/* =====================================================
   Data Type
===================================================== */

export function getKpiDataType(
  kpi: KpiApi,
): string {
  return (
    kpi?.unit ||
    "-"
  );
}

/* =====================================================
   KPI → Indicator
===================================================== */

export function mapKpiToDashboardIndicator(
  kpi: KpiApi,
): Indicator {
  const result =
    getKpiResult(kpi);

  const target =
    toNumber(kpi?.targetValue);

  return {
    id: String(
      kpi?.id ?? "",
    ),

    year: String(
      kpi?.year ?? "",
    ),

    code:
      kpi?.kpiCode ??
      "-",

    name:
      kpi?.kpiName ??
      "-",

    department:
      kpi?.departmentName ??
      "-",

    owner:
      [
        kpi?.firstName,
        kpi?.lastName,
      ]
        .filter(Boolean)
        .join(" ") || "-",

    dataType:
      kpi?.unit ??
      "-",

    target:
      target ?? 0,

    unit:
      kpi?.unit ??
      "-",

    result,

    // ใช้ค่าจาก API โดยตรง
    kpiSubmissionStatus:
      kpi?.kpiSubmissionStatus ?? null,

    // เก็บ status เดิมไว้สำหรับส่วนอื่นของระบบ
    status: mapKpiStatus(
      kpi?.kpiSubmissionStatus,
    ),
  };
}
/* =====================================================
   KPI[] → Indicator[]
===================================================== */

export function mapKpisToDashboardIndicators(
  kpis: KpiApi[],
): Indicator[] {
  if (!Array.isArray(kpis)) {
    return [];
  }

  return kpis.map(
    mapKpiToDashboardIndicator,
  );
}

/* =====================================================
   KPI Summary
===================================================== */
export interface KpiSummary {
  total: number;
  achieved: number;
  notAchieved: number;
  noData: number;
}

export function getKpiSummary(
  indicators: Indicator[],
): KpiSummary {
  const total = indicators.length;

  const achieved = indicators.filter(
    (item) => item.status === "Submitted",
  ).length;

  const notAchieved = indicators.filter(
    (item) => item.status === "warning",
  ).length;

  const noData = indicators.filter(
    (item) =>
      item.status === "Pending" ||
      item.result === null ||
      item.result === undefined,
  ).length;

  return {
    total,
    achieved,
    notAchieved,
    noData,
  };
}
/* =====================================================
   Pie Data
===================================================== */

export function getPieData(
  indicators: Indicator[],
): PieDatum[] {
  const total =
    indicators.length;

  if (total === 0) {
    return [
      {
        name: "Pending",
        value: 0,
        color: "var(--muted)",
      },
      {
        name: "Submitted",
        value: 0,
        color: "var(--success)",
      },
      {
        name: "warning",
        value: 0,
        color: "var(--warning)",
      },
    ];
  }

  const pending =
    indicators.filter(
      (item) =>
        item.status === "Pending",
    ).length;

  const submitted =
    indicators.filter(
      (item) =>
        item.status === "Submitted",
    ).length;

  const warning =
    indicators.filter(
      (item) =>
        item.status === "warning",
    ).length;

  return [
    {
      name: "ไม่มีข้อมูล",
      value: Math.round(
        (pending / total) * 100,
      ),
      color: "var(--danger)",
    },

    {
      name: "บรรลุเป้าหมาย",
      value: Math.round(
        (submitted / total) * 100,
      ),
      color: "var(--success)",
    },

    {
      name: "ไม่บรรลุเป้าหมาย",
      value: Math.round(
        (warning / total) * 100,
      ),
      color: "var(--warning)",
    },
  ];
}

/* =====================================================
   Dynamic Analysis Data
===================================================== */

export function mapKpisToAnalysisData(
  kpis: KpiApi[],
): AnalysisDatum[] {
  if (!Array.isArray(kpis)) {
    return [];
  }

  /*
   * Group KPI ตามปี
   */

  const grouped =
    new Map<
      string,
      KpiApi[]
    >();

  for (const kpi of kpis) {
    const year =
      String(
        kpi?.year ?? "",
      );

    if (!year) {
      continue;
    }

    const current =
      grouped.get(year) ?? [];

    current.push(kpi);

    grouped.set(
      year,
      current,
    );
  }

  /*
   * สร้างข้อมูลแต่ละปี
   */

  return Array.from(
    grouped.entries(),
  )
    .sort(
      ([yearA], [yearB]) =>
        Number(yearA) -
        Number(yearB),
    )
    .map(
      ([year, yearKpis]) => {

        /*
         * AnalysisDatum
         *
         * เริ่มด้วย year + target
         */

        const row: AnalysisDatum = {
          year,
          target: 0,
        };

        /*
         * วน KPI ในปีนั้น
         */

        for (
          const kpi of yearKpis
        ) {

          /*
           * Target
           */

          const target =
            toNumber(
              kpi?.targetValue,
            ) ?? 0;

          row.target += target;

          /*
           * Comparison
           */

          const comparisons =
            Array.isArray(
              kpi?.kpiComparison,
            )
              ? kpi.kpiComparison
                  .filter(
                    (item) =>
                      item &&
                      !item.isDeleted &&
                      item.name &&
                      item.name.trim() !== "",
                  )
                  .sort(
                    (a, b) =>
                      Number(
                        a?.seq ?? 0,
                      ) -
                      Number(
                        b?.seq ?? 0,
                      ),
                  )
              : [];

          /*
           * Dynamic
           *
           * ไม่กำหนด q1 / q2
           *
           * ใช้ name จาก API
           */

          for (
            const comparison of comparisons
          ) {

            const name =
              String(
                comparison?.name ?? "",
              ).trim();

            if (!name) {
              continue;
            }

            const result =
              toNumber(
                comparison?.result,
              );

            if (result === null) {
              continue;
            }

            /*
             * ถ้าชื่อเดียวกันหลาย KPI
             * ให้รวมค่ากัน
             */

            const currentValue =
              row[name];

            if (
              typeof currentValue ===
              "number"
            ) {
              row[name] =
                currentValue +
                result;
            } else {
              row[name] = result;
            }
          }
        }

        return row;
      },
    );
}

/* =====================================================
   Dynamic Analysis Indicator Options
===================================================== */

export function getAnalysisIndicatorOptions(
  kpis: KpiApi[],
): FilterOption[] {
  if (!Array.isArray(kpis)) {
    return [];
  }

  const unique =
    new Map<
      string,
      FilterOption
    >();

  for (
    const kpi of kpis
  ) {
    const code =
      kpi?.kpiCode;

    if (!code) {
      continue;
    }

    if (
      unique.has(
        String(kpi.id),
      )
    ) {
      continue;
    }

    unique.set(
      String(kpi.id),
      {
        value: String(
          kpi.id ?? code,
        ),

        label: `${code} ${
          kpi?.kpiName ?? ""
        }`.trim(),
      },
    );
  }

  return Array.from(
    unique.values(),
  );
}

/* =====================================================
   Category
===================================================== */

export function getKpiCategoryName(
  kpi: KpiApi,
): string {
  return (
    kpi?.kpiCategory
      ?.categoryName ??
    "-"
  );
}

/* =====================================================
   Frequency
===================================================== */

export function getKpiFrequencyName(
  kpi: KpiApi,
): string {
  return (
    kpi?.frequency
      ?.frequencyName ??
    "-"
  );
}

/* =====================================================
   Month
===================================================== */

export function getKpiMonthName(
  kpi: KpiApi,
): string {
  return (
    kpi?.monthOfDelivery
      ?.name ??
    "-"
  );
}