// import type { Indicator } from "@/types/indicator-Edpx"
// import { emptyCollectors, type IndicatorFormValues } from "@/lib/indicator-schema"

// export function indicatorToFormValues(
//   indicator: Indicator,
// ): IndicatorFormValues {
//   const collectors = emptyCollectors.map((empty, index) => ({
//     name: indicator.collectors[index]?.name ?? empty.name,
//     result: indicator.collectors[index]?.result ?? empty.result,
//   }))

//   return {
//     year: indicator.year,
//     indicatorType: indicator.indicatorType,
//     code: indicator.code,
//     name: indicator.name,
//     targetCondition: indicator.targetCondition,
//     target: String(indicator.target),
//     unit: indicator.unit,
//     collectionPeriod: indicator.collectionPeriod,
//     months: indicator.months,
//     department: indicator.department,
//     owner: indicator.owner,
//     collectors,
//   }
// }
import type { IndicatorFormValues } from "./indicator-schema";

const emptyCollectors = [
  {
    name: "",
    result: "",
  },
  {
    name: "",
    result: "",
  },
  {
    name: "",
    result: "",
  },
];
export function indicatorToFormValues(
  indicator: any,
): IndicatorFormValues {
  // ============================================
  // Collectors
  // ============================================

  const apiCollectors = Array.isArray(
    indicator?.collectors,
  )
    ? indicator.collectors
    : [];

  const apiComparisons = Array.isArray(
    indicator?.kpiComparison,
  )
    ? indicator.kpiComparison
    : [];

  const collectorData =
    apiComparisons.length > 0
      ? apiComparisons
      : apiCollectors;

  const collectors = emptyCollectors.map(
    (empty, index) => {
      const item = collectorData[index];

      return {
        name:
          item?.name ??
          item?.comparisonName ??
          empty.name,

        result:
          item?.result ??
          item?.value ??
          empty.result,
      };
    },
  );

  // ============================================
  // Months
  // ============================================
  //
  // API:
  //
  // monthOfDelivery: {
  //   id: 11,
  //   name: "พฤศจิกายน",
  //   value: "11"
  // }
  //
  // Form:
  //
  // months: ["11"]
  //
  // IndicatorMonthSection:
  //
  // const monthId = String(month.id);
  // const checked = selected.includes(monthId);
  //
  // ============================================

  let months: string[] = [];

  // --------------------------------------------
  // กรณี API ส่ง monthOfDelivery เป็น object
  // --------------------------------------------

  if (
    indicator?.monthOfDelivery &&
    typeof indicator.monthOfDelivery === "object" &&
    !Array.isArray(indicator.monthOfDelivery)
  ) {
    const month =
      indicator.monthOfDelivery;

    if (month.id != null) {
      months = [String(month.id)];
    } else if (month.value != null) {
      months = [String(month.value)];
    }
  }

  // --------------------------------------------
  // กรณี API ส่ง monthOfDelivery เป็น array
  // --------------------------------------------

  else if (
    Array.isArray(
      indicator?.monthOfDelivery,
    )
  ) {
    months = indicator.monthOfDelivery
      .map((item: any) => {
        if (item == null) {
          return null;
        }

        if (
          typeof item === "object"
        ) {
          if (item.id != null) {
            return String(item.id);
          }

          if (
            item.monthId != null
          ) {
            return String(
              item.monthId,
            );
          }

          if (
            item.month_id != null
          ) {
            return String(
              item.month_id,
            );
          }

          if (
            item.value != null
          ) {
            return String(
              item.value,
            );
          }

          return null;
        }

        return String(item);
      })
      .filter(
        (
          value: string | null,
        ): value is string =>
          value !== null &&
          value !== "",
      );
  }

  // --------------------------------------------
  // Fallback:
  // กรณี API ส่ง months
  // --------------------------------------------

  if (
    months.length === 0 &&
    Array.isArray(indicator?.months)
  ) {
    months = indicator.months
      .map((item: any) => {
        if (item == null) {
          return null;
        }

        if (
          typeof item === "object"
        ) {
          if (item.id != null) {
            return String(item.id);
          }

          if (
            item.monthId != null
          ) {
            return String(
              item.monthId,
            );
          }

          if (
            item.month_id != null
          ) {
            return String(
              item.month_id,
            );
          }

          if (
            item.value != null
          ) {
            return String(
              item.value,
            );
          }

          return null;
        }

        return String(item);
      })
      .filter(
        (
          value: string | null,
        ): value is string =>
          value !== null &&
          value !== "",
      );
  }

  // ============================================
  // Debug
  // ============================================

  console.log(
    "API monthOfDelivery:",
    indicator?.monthOfDelivery,
  );

  console.log(
    "FORM months:",
    months,
  );

  // ============================================
  // Return
  // ============================================

  return {
    code:
      indicator?.kpiCode ??
      indicator?.code ??
      "",

    name:
      indicator?.kpiName ??
      indicator?.name ??
      "",

    year:
      indicator?.year != null
        ? String(
            indicator.year,
          )
        : "",

    indicatorType:
      indicator?.kpiCategory?.id != null
        ? String(
            indicator.kpiCategory.id,
          )
        : indicator?.indicatorType != null
          ? String(
              indicator.indicatorType,
            )
          : "",

    targetCondition:
      indicator?.targetCondition?.id != null
        ? String(
            indicator.targetCondition.id,
          )
        : indicator?.targetConditionId != null
          ? String(
              indicator.targetConditionId,
            )
          : "",

    target:
      indicator?.targetValue != null
        ? String(
            indicator.targetValue,
          )
        : indicator?.target != null
          ? String(
              indicator.target,
            )
          : "",

    unit:
      indicator?.unit ??
      "",

    collectionPeriod:
      indicator?.frequency?.id != null
        ? String(
            indicator.frequency.id,
          )
        : indicator?.frequencyId != null
          ? String(
              indicator.frequencyId,
            )
          : "",

    department:
      indicator?.department?.id != null
        ? String(
            indicator.department.id,
          )
        : indicator?.departmentId != null
          ? String(
              indicator.departmentId,
            )
          : "",

    owner:
      indicator?.userId != null
        ? String(
            indicator.userId,
          )
        : indicator?.ownerId != null
          ? String(
              indicator.ownerId,
            )
          : indicator?.owner?.id != null
            ? String(
                indicator.owner.id,
              )
            : "",

    months,

    collectors,
  };
}