export type IndicatorStatus = 'completed' | 'pending' | 'rejected'

export interface Indicator {
  id: number
  /** Owner of the indicator — used for Row Level Security */
  assignedUserId: string
  /** ปีข้อมูล */
  dataYear: string
  /** ประเภทตัวชี้วัด */
  type: string
  /** รหัสตัวชี้วัด */
  code: string
  /** ตัวชี้วัด */
  name: string
  /** หน่วยงานที่รับผิดชอบ */
  department: string
  /** เวลาที่ส่งมอบ */
  deliveryTime: string
  /** ระยะเวลาการเก็บข้อมูล */
  collectionPeriod: string
  /** เป้าหมาย */
  target: string
  /** หน่วยนับ */
  unit: string
  /** ผลประเมิน (ค่าผลลัพธ์ล่าสุด) */
  resultValue: number | null
  /** สถานะ */
  status: IndicatorStatus

  /* ---- ข้อมูลเชิงกลยุทธ์สำหรับ Detail Modal ---- */
  /** ตัวชี้วัด EdPEx */
  edpexIndicator: string
  /** ตัวชี้วัดกลยุทธ์ */
  strategicIndicator: string
  /** ตัวชี้วัด OKRs */
  okrsIndicator: string
}

export const STATUS_LABELS: Record<IndicatorStatus, string> = {
  completed: 'ส่งแล้ว',
  pending: 'รอดำเนินการ',
  rejected: 'ไม่ผ่าน',
}
