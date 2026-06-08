export type IndicatorStatus = 'pass' | 'fail' | 'no-data'

export interface Indicator {
  id: string
  year: string
  code: string
  name: string
  department: string
  owner: string
  dataType: string
  target: number
  unit: string
  result: number | null
  status: IndicatorStatus
}

export interface KpiSummary {
  total: number
  achieved: number
  notAchieved: number
  noData: number
}

export interface PieDatum {
  name: string
  value: number
  color: string
}

export interface AnalysisDatum {
  year: string
  ubru: number
  target: number
  q1: number
  q2: number
}

export interface FilterOption {
  label: string
  value: string
}

export interface DashboardFilters {
  year: string
  indicatorType: string
  department: string
  branch: string
}
