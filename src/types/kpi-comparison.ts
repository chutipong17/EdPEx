export interface KpiYearComparison {
  year: string;
  target: number | null;
  actualValue: number | null;
}

export interface KpiComparisonGraph {
  kpiCode: string;
  kpiName: string;
  unit: string | null;
  categoryId: number | null;
  data: KpiYearComparison[];
}