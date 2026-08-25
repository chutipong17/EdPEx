export type IndicatorStatus =
  | 'pass'
  | 'fail'
  | 'no-data'


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


/**
 * ข้อมูลที่ใช้สำหรับ Recharts
 *
 * ไม่กำหนด q1 / q2 แบบตายตัว
 * เพราะ kpiComparison จาก API สามารถมีได้หลายรายการ
 *
 * ตัวอย่าง:
 *
 * {
 *   year: "2568",
 *   target: 80,
 *   Q1: 75,
 *   Q2: 82,
 *   Q3: 85,
 *   Q4: 90
 * }
 */
export interface AnalysisDatum {
  year: string
  target: number

  [key: string]: string | number | null
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