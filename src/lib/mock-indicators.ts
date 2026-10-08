import type { Indicator } from "@/types/indicator-Edpx"

export const indicators: Indicator[] = [

]

export function getIndicatorById(
  id: string | number
): Indicator | undefined {
  const numericId = Number(id)

  return indicators.find(
    (indicator) => indicator.id === numericId
  )
}


