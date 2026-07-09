export type IndicatorStatus = "success" | "warning" | "danger"

export type IndicatorDataType = "ปริมาณ" | "ร้อยละ" | "สัดส่วน" | "ค่าเฉลี่ย"

export type CollectionPeriod = "รายเดือน" | "รายไตรมาส" | "รายปี" | "ปีการศึกษา"

export type TargetCondition = "มากกว่าหรือเท่ากับ" | "น้อยกว่าหรือเท่ากับ" | "เท่ากับ" | "อยู่ในช่วง"

export interface Collector {
  name: string
  result: string
}

export interface Indicator {
  id: string
  year: string
  indicatorType: string
  code: string
  name: string
  department: string
  owner: string
  dataType: IndicatorDataType
  targetCondition: TargetCondition
  target: number
  unit: string
  result: number | null
  status: IndicatorStatus
  collectionPeriod: CollectionPeriod
  months: string[]
  collectors: Collector[]
}

export const MONTHS: string[] = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
]

export const INDICATOR_TYPES: string[] = [
  "ตัวชี้วัด EdPEx",
  "ตัวชี้วัดกลยุทธ์",
  "ตัวชี้วัด OKRs",
  "ด้านการบริหารจัดการ",
  "ด้านทำนุบำรุงศิลปวัฒนธรรม",
]

// export const DATA_YEARS: string[] = ["2567", "2566", "2565", "2564"]
export const DATA_YEARS: string[] = Array.from(
  { length: 6 },
  (_, index) => String(new Date().getFullYear() + 543 - index)
)

export const DATA_TYPES: IndicatorDataType[] = ["ปริมาณ", "ร้อยละ", "สัดส่วน", "ค่าเฉลี่ย"]

export const TARGET_CONDITIONS: TargetCondition[] = [
  "มากกว่าหรือเท่ากับ",
  "น้อยกว่าหรือเท่ากับ",
  "เท่ากับ",
  "อยู่ในช่วง",
]

export const COLLECTION_PERIODS: CollectionPeriod[] = ["รายเดือน", "รายไตรมาส", "รายปี","ปีการศึกษา"]
