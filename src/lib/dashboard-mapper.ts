import type {
  Indicator,
  IndicatorStatus,
  AnalysisDatum,
  PieDatum,
  FilterOption,
  KpiAssignment,
  KpiSubmission,
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

  /* =====================================================
     Submission Status
  ===================================================== */

  kpiSubmissionStatus?: string | null;

  /* =====================================================
     KPI Submission
  ===================================================== */

  kpiSubmission?: {
    id?: number;
    kpiId?: number;
    actualValue?: string | number | null;
    isDeleted?: boolean;
  } | null;

  /* =====================================================
     KPI Category
  ===================================================== */

  kpiCategory?: {
    id?: number;
    categoryName?: string;
    isDeleted?: boolean;
  } | null;

  /* =====================================================
     Frequency
  ===================================================== */

  frequency?: {
    id?: number;
    frequencyName?: string;
    isDeleted?: boolean;
  } | null;

  /* =====================================================
     Month
  ===================================================== */

  monthOfDelivery?: {
    id?: number;
    name?: string;
    value?: string;
  } | null;

  /* =====================================================
     Target Condition
  ===================================================== */

  targetCondition?: {
    id?: number;
    conditionName?: string;
    description?: string;
  } | null;

  /* =====================================================
     KPI Comparison
  ===================================================== */

  kpiComparison?: KpiComparison[];

  /* =====================================================
     KPI Assignment
  ===================================================== */

  kpiAssignment?: KpiAssignment[];

  /* =====================================================
     KPI Target
  ===================================================== */

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
   KPI Assignment
===================================================== */

/**
 * แปลง kpiAssignment จาก API
 *
 * จุดสำคัญ:
 *
 * API
 *   kpiAssignment[]
 *      └── kpiSubmission[]
 *
 * จะถูกส่งต่อไปยัง Indicator โดยไม่ตัดข้อมูลออก
 */
function getKpiAssignments(
  kpi: KpiApi,
): KpiAssignment[] {
  if (
    !Array.isArray(
      kpi?.kpiAssignment,
    )
  ) {
    return [];
  }

  return kpi.kpiAssignment;
}

/* =====================================================
   KPI Actual Value
===================================================== */

/**
 * ดึง actualValue จาก KPI Assignment
 *
 * kpiAssignment[]
 *      ↓
 * kpiSubmission[]
 *      ↓
 * actualValue
 */
export function getKpiActualValue(
  kpi: KpiApi,
): string | null {
  const assignments =
    getKpiAssignments(kpi);

  const submissions =
    assignments.flatMap(
      (assignment) =>
        assignment.kpiSubmission ?? [],
    );

  const validSubmissions =
    submissions.filter(
      (submission) =>
        !submission.isDeleted,
    );

  if (
    validSubmissions.length === 0
  ) {
    return null;
  }

  /*
   * เอาข้อมูลล่าสุด
   */
  const latest =
    [...validSubmissions].sort(
      (a, b) =>
        new Date(
          b.updatedAt,
        ).getTime() -
        new Date(
          a.updatedAt,
        ).getTime(),
    )[0];

  return (
    latest?.actualValue ??
    null
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
    toNumber(
      kpi?.targetValue,
    );

  /*
   * สำคัญ
   *
   * เก็บ kpiAssignment เอาไว้
   * เพื่อให้ IndicatorTable
   * สามารถเข้าถึง
   *
   * row.kpiAssignment
   *      ↓
   * kpiSubmission
   *      ↓
   * actualValue
   */
  const kpiAssignment =
    getKpiAssignments(kpi);

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

    /* =================================================
       Status
    ================================================= */

    kpiSubmissionStatus:
      kpi?.kpiSubmissionStatus ??
      null,

    status:
      mapKpiStatus(
        kpi?.kpiSubmissionStatus,
      ),

    /* =================================================
       KPI Assignment
    ================================================= */

    kpiAssignment,
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
  const total =
    indicators.length;

  const achieved =
    indicators.filter(
      (item) =>
        item.status ===
        "Submitted",
    ).length;

  const notAchieved =
    indicators.filter(
      (item) =>
        item.status ===
        "warning",
    ).length;

  const noData =
    indicators.filter(
      (item) =>
        item.status ===
          "Pending" ||
        item.result === null ||
        item.result ===
          undefined,
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
        item.status ===
        "Pending",
    ).length;

  const submitted =
    indicators.filter(
      (item) =>
        item.status ===
        "Submitted",
    ).length;

  const warning =
    indicators.filter(
      (item) =>
        item.status ===
        "warning",
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
        const row: AnalysisDatum = {
          year,
          target: 0,
        };

        for (
          const kpi of yearKpis
        ) {
          const target =
            toNumber(
              kpi?.targetValue,
            ) ?? 0;

          row.target += target;

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

            if (
              result === null
            ) {
              continue;
            }

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