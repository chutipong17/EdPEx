
export interface IndicatorDataPoint {
  year: string
  ubru: number
  target: number
  q1: number
  q2: number
}

export type IndicatorCategory =
  | "7.1"
  | "7.2"
  | "7.3"
  | "7.4"
  | "7.5"

export interface IndicatorGraph {
  id: string
  /** e.g. "ตัวชี้วัด 7.1(1)-01" */
  code: string
  /** Short description shown under the code */
  description: string
  category: IndicatorCategory
  data: IndicatorDataPoint[]
}

export interface FilterState {
  year: string | null
  category: string | null
  chartType: string | null
  search: string | null
}
