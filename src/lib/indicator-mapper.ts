import type { Indicator } from "@/types/indicator-Edpx"
import { emptyCollectors, type IndicatorFormValues } from "@/lib/indicator-schema"

export function indicatorToFormValues(
  indicator: Indicator,
): IndicatorFormValues {
  const collectors = emptyCollectors.map((empty, index) => ({
    name: indicator.collectors[index]?.name ?? empty.name,
    result: indicator.collectors[index]?.result ?? empty.result,
  }))

  return {
    year: indicator.year,
    indicatorType: indicator.indicatorType,
    code: indicator.code,
    name: indicator.name,
    targetCondition: indicator.targetCondition,
    target: String(indicator.target),
    unit: indicator.unit,
    collectionPeriod: indicator.collectionPeriod,
    months: indicator.months,
    department: indicator.department,
    owner: indicator.owner,
    collectors,
  }
}
