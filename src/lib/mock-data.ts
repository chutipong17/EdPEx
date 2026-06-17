import type {
  AnalysisDatum,
  FilterOption,
  Indicator,
  IndicatorStatus,
  KpiSummary,
  PieDatum,
} from '@/types/dashboard'
import type { IndicatorGraph, IndicatorDataPoint } from "@/types/indicator-graph"

export const kpiSummary: KpiSummary = {
  total: 50,
  achieved: 39,
  notAchieved: 10,
  noData: 1,
}

export const pieData: PieDatum[] = [
  { name: 'บรรลุเป้าหมาย', value: 85, color: 'var(--success)' },
  { name: 'ยังไม่บรรลุเป้าหมาย', value: 10, color: 'var(--warning)' },
  { name: 'ไม่มีข้อมูล', value: 5, color: 'var(--danger)' },
]

export const analysisData: AnalysisDatum[] = [
  { year: '2566', ubru: 10, target: 10, q1: 8, q2: 3 },
  { year: '2567', ubru: 15, target: 10, q1: 8, q2: 7 },
  { year: '2568', ubru: 0, target: 10, q1: 4, q2: 1 },
  { year: '2569', ubru: 0, target: 10, q1: 4, q2: 1 },
]

export const yearOptions: FilterOption[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: '2569', value: '2569' },
  { label: '2568', value: '2568' },
  { label: '2567', value: '2567' },
  { label: '2566', value: '2566' },
]

export const indicatorTypeOptions: FilterOption[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'ตัวชี้วัดเชิงยุทธศาสตร์', value: 'strategic' },
  { label: 'ตัวชี้วัดเชิงปฏิบัติการ', value: 'operational' },
  { label: 'ตัวชี้วัดคุณภาพ', value: 'quality' },
]

export const departmentOptions: FilterOption[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'สำนักงานอธิการบดี', value: 'president-office' },
  { label: 'คณะวิทยาศาสตร์', value: 'science' },
  { label: 'คณะครุศาสตร์', value: 'education' },
  { label: 'คณะบริหารธุรกิจ', value: 'business' },
  { label: 'คณะเทคโนโลยีอุตสาหกรรม', value: 'industry' },
]

export const branchOptions: FilterOption[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'วิทยาเขตหลัก', value: 'main' },
  { label: 'วิทยาเขตเมือง', value: 'city' },
]

export const analysisIndicatorOptions: FilterOption[] = [
  { label: 'KPI-01 ความพึงพอใจผู้เรียน', value: 'kpi-01' },
  { label: 'KPI-02 อัตราการมีงานทำ', value: 'kpi-02' },
  { label: 'KPI-03 ผลงานวิจัยตีพิมพ์', value: 'kpi-03' },
]

const departments = [
  'สำนักงานอธิการบดี',
  'คณะวิทยาศาสตร์',
  'คณะครุศาสตร์',
  'คณะบริหารธุรกิจ',
  'คณะเทคโนโลยีอุตสาหกรรม',
]

const owners = [
  'ดร.สมชาย ใจดี',
  'ผศ.ดร.วิภา ศรีสุข',
  'รศ.ดร.ประเสริฐ มั่นคง',
  'อ.กนกพร แสงทอง',
  'ดร.ธนพล วงศ์เจริญ',
]

const dataTypes = ['ร้อยละ', 'จำนวน', 'ระดับ', 'คะแนน']
const units = ['ร้อยละ', 'คน', 'ระดับ', 'ผลงาน', 'คะแนน']
const indicatorNames = [
  'ความพึงพอใจของผู้เรียนต่อคุณภาพการสอน',
  'อัตราการมีงานทำของบัณฑิต',
  'จำนวนผลงานวิจัยที่ได้รับการตีพิมพ์',
  'ร้อยละความสำเร็จของโครงการบริการวิชาการ',
  'ระดับความผูกพันของบุคลากร',
  'อัตราการคงอยู่ของนักศึกษา',
  'จำนวนนวัตกรรมที่นำไปใช้ประโยชน์',
  'ความพึงพอใจของผู้มีส่วนได้ส่วนเสีย',
  'ร้อยละการเบิกจ่ายงบประมาณ',
  'จำนวนความร่วมมือกับองค์กรภายนอก',
]

function statusFromValues(result: number | null, target: number): IndicatorStatus {
  if (result === null) return 'no-data'
  return result >= target ? 'pass' : 'fail'
}

function seeded(i: number): number {
  // deterministic pseudo-random for stable SSR/CSR rendering
  const x = Math.sin(i * 99.13) * 10000
  return x - Math.floor(x)
}

export const indicators: Indicator[] = Array.from({ length: 50 }, (_, i) => {
  const year = ['2566', '2567', '2568', '2569'][i % 4]
  const target = Math.round(60 + seeded(i) * 35)
  const noData = i === 7
  const result = noData ? null : Math.round(40 + seeded(i + 1) * 60)
  return {
    id: `ind-${i + 1}`,
    year,
    code: `KPI-${String(i + 1).padStart(2, '0')}`,
    name: indicatorNames[i % indicatorNames.length],
    department: departments[i % departments.length],
    owner: owners[i % owners.length],
    dataType: dataTypes[i % dataTypes.length],
    target,
    unit: units[i % units.length],
    result,
    status: statusFromValues(result, target),
  }
})


/// กราฟผลลัพธ์


const YEARS = ["2566", "2567", "2568"] as const


function makeData(seed: number): IndicatorDataPoint[] {
  // Deterministic pseudo-random values so the dashboard renders consistently.
  return YEARS.map((year, i) => {
    const base = ((seed + i * 7) % 5) + 1
    return {
      year,
      ubru: Math.min(5, base + 1),
      target: 5,
      q1: Math.max(1, base),
      q2: Math.max(1, base - 1 - (i % 2)),
    }
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  "7.1": "ผลลัพธ์ด้านการเรียนรู้ของผู้เรียน",
  "7.2": "ผลลัพธ์ด้านการมุ่งเน้นลูกค้า",
  "7.3": "ผลลัพธ์ด้านการมุ่งเน้นบุคลากร",
  "7.4": "ผลลัพธ์ด้านการนำองค์กรและธรรมาภิบาล",
  "7.5": "ผลลัพธ์ด้านงบประมาณ การเงิน และตลาด",
}

export const CATEGORIES = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label: `${value} ${label}` }),
)

export const YEAR_OPTIONS = YEARS.map((y) => ({ value: y, label: y }))

export const CHART_TYPE_OPTIONS = [
  { value: "composed", label: "กราฟแท่งและเส้น" },
  { value: "bar", label: "กราฟแท่ง" },
  { value: "line", label: "กราฟเส้น" },
]

const descriptions = [
  "ร้อยละความพึงพอใจของผู้เรียนต่อหลักสูตร",
  "อัตราการสำเร็จการศึกษาตามระยะเวลา",
  "ระดับผลการประเมินตามเกณฑ์คุณภาพ",
  "จำนวนผลงานที่ได้รับการเผยแพร่ระดับชาติ",
  "ค่าเฉลี่ยคะแนนการประเมินสมรรถนะ",
  "ร้อยละการบรรลุเป้าหมายตามแผนปฏิบัติการ",
]

export const indicatorsGraph: IndicatorGraph[] = Array.from({ length: 18 }, (_, idx) => {
  const categoryKeys = Object.keys(CATEGORY_LABELS)
  const category = categoryKeys[idx % categoryKeys.length]
  const sub = (idx % 4) + 1
  const num = String((idx % 9) + 1).padStart(2, "0")
  return {
    id: `ind-${idx + 1}`,
    code: `ตัวชี้วัด ${category}(${sub})-${num}`,
    description: descriptions[idx % descriptions.length],
    category: category as  IndicatorGraph["category"],
    data: makeData(idx + 1),
  }
})

export const SERIES = [
  { key: "ubru", label: "UBRU", color: "var(--chart-1)", type: "bar" as const },
  { key: "target", label: "เป้าหมาย", color: "var(--chart-2)", type: "line" as const },
  { key: "q1", label: "ครั้งที่ 1", color: "var(--chart-3)", type: "bar" as const },
  { key: "q2", label: "ครั้งที่ 2", color: "var(--chart-4)", type: "bar" as const },
]
