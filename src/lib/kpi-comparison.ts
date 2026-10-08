import type { KpiApi } from "@/types/kpi-kpi";
import type {
  KpiComparisonGraph,
  KpiYearComparison,
} from "@/types/kpi-comparison";

function getActualValue(kpi: KpiApi): number | null {
  for (const assignment of kpi.kpiAssignment ?? []) {
    for (const submission of assignment.kpiSubmission ?? []) {
      if (submission.isDeleted) continue;

      if (
        submission.actualValue !== null &&
        submission.actualValue !== undefined &&
        submission.actualValue !== null
      ) {
        const value = Number(submission.actualValue);

        if (!Number.isNaN(value)) {
          return value;
        }
      }
    }
  }

  return null;
}

export function mapKpisToComparisonGraph(
  kpis: KpiApi[],
): KpiComparisonGraph[] {
  const grouped = new Map<string, KpiComparisonGraph>();

  for (const kpi of kpis) {
    if (kpi.isDeleted) continue;

    // สำคัญ: normalize เป็น string ตั้งแต่ตรงนี้
    const key = String(kpi.kpiCode);

    if (!grouped.has(key)) {
      grouped.set(key, {
        kpiCode: key,
        kpiName: kpi.kpiName,
        unit: kpi.unit ?? null,
        categoryId: kpi.kpiCategoryId ?? null,
        data: [],
      });
    }

    const target =
      kpi.targetValue === null ||
      kpi.targetValue === undefined ||
      kpi.targetValue === ""
        ? null
        : Number(kpi.targetValue);

    const actualValue = getActualValue(kpi);

    const yearData: KpiYearComparison = {
      year: String(kpi.year),
      target:
        target !== null && !Number.isNaN(target)
          ? target
          : null,
      actualValue,
    };

    grouped.get(key)!.data.push(yearData);
  }

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    data: item.data.sort(
      (a, b) => Number(a.year) - Number(b.year),
    ),
  }));
}