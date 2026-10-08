import type { KpiApi } from "@/types/kpi-kpi";
import type {
  IndicatorGraph,
  IndicatorDataPoint,
} from "@/types/indicator-graph";

function getActualValue(kpi: KpiApi): number | null {
  for (const assignment of kpi.kpiAssignment ?? []) {
    for (const submission of assignment.kpiSubmission ?? []) {
      if (
        !submission.isDeleted &&
        submission.actualValue !== null &&
        submission.actualValue !== undefined
      ) {
        return Number(submission.actualValue);
      }
    }
  }

  return null;
}

export function mapKpiToIndicatorGraph(
  kpi: KpiApi,
): IndicatorGraph {
  const comparisonData: Record<string, number | null> = {};

  for (const comparison of kpi.kpiComparison ?? []) {
    if (comparison.isDeleted) continue;

    const key = comparison.name?.trim();

    if (!key) continue;

    comparisonData[key] =
      comparison.result === null
        ? null
        : Number(comparison.result);
  }

  const target =
    kpi.targetValue === null || kpi.targetValue === undefined
      ? null
      : Number(kpi.targetValue);

  const actualValue = getActualValue(kpi);

  const dataPoint: IndicatorDataPoint = {
    year: String(kpi.year),
    target,
    ...comparisonData,
    actualValue,
  };

  return {
    id: String(kpi.id),
    code: kpi.kpiCode,
    description: kpi.kpiName,
    category: String(kpi.kpiCategoryId),
    data: [dataPoint],
  };
}

export function mapKpisToIndicatorGraphs(
  kpis: KpiApi[],
): IndicatorGraph[] {
  return kpis.map(mapKpiToIndicatorGraph);
}