import type {
  AnalysisDatum,
  FilterOption,
  Indicator,
  IndicatorStatus,
  KpiSummary,
  PieDatum,
} from '@/types/dashboard'

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
