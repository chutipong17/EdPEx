export type IndicatorStatus = "success" | "warning" | "danger" ;
export type IndicatorStatusKpiSubmission  = "Pending" | "Submitted" |"warning";
export type IndicatorDataType = "ปริมาณ" | "ร้อยละ" | "สัดส่วน" | "ค่าเฉลี่ย";

export type CollectionPeriod =
  | "รายเดือน"
  | "รายไตรมาส"
  | "รายปี"
  | "ปีการศึกษา";

export type TargetCondition =
  | "มากกว่าหรือเท่ากับ"
  | "น้อยกว่าหรือเท่ากับ"
  | "เท่ากับ"
  | "อยู่ในช่วง";

export interface Collector {
  name: string;
  result: string;
}
export interface KpiComparison {
  seq: number;
  name: string;
  result: string;
}
export interface kpiCategories {
  categoryName: string;
}
export interface Frequency {
  frequencyName: string;
}
export interface StatusData {
  id: number
  name: string
  description: string
}

export interface KpiAssignment {
  id: number;
  userId: number;
  kpiId: number;

  assignedDate: string;
  dueDate: string | null;

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string | null;

  createdBy: string;
  updatedBy: string | null;

  kpiSubmission: KpiSubmission[];
}

export interface KpiSubmission {
  id: number
  kpiAssignmentId: number
  statusId: number

  submittedBy: string | null
  submittedDate: string | null

  achievementPercent: string | null
  actualValue: string | null
  calculatedScore: string | null

  description: string | null

  createdAt: string
  createdBy: string

  isDeleted: boolean

  status: StatusData
  kpiSubmission: KpiSubmission[]
}

export interface Indicator {
  // id: string
  // kpiCategoryId: number;
  // departmentId: number;
  // monthOfDeliveryId: number;
  firstName:string
  lastName:string
  frequencyId: number;
  // targetConditionId: number;
  // userId: number;
  // indicatorType:string;
  departmentName:string;
  // dataType: IndicatorDataType
  kpiCode: string;
  kpiName: string;
  description: string;
  // status: IndicatorStatus
  // unit: string;
  targetValue: number;
  // year: number;
  // remark: string;
  // result: number | null
  // kpiComparison: KpiComparison[]
  // owner: string
  frequency: Frequency;
  id: number;
  year: string;
  indicatorType: string;
  code: string;
  name: string;
  department: string;
  owner: string;
  dataType: IndicatorDataType;
  targetCondition: TargetCondition;
  target: number;
  unit: string;
  result: number | null;
  status: IndicatorStatus;
  collectionPeriod: CollectionPeriod;
  months: string[];
  collectors: Collector[];
  kpiCategory: kpiCategories;
  // kpiAssignment: KpiAssignment[];
  kpiAssignment: KpiSubmission[],
  submission: KpiSubmission[],
  getSubmission:KpiSubmission
   
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
];

export const INDICATOR_TYPES: string[] = [
  "ตัวชี้วัด EdPEx",
  "ตัวชี้วัดกลยุทธ์",
  "ตัวชี้วัด OKRs",
  "ด้านการบริหารจัดการ",
  "ด้านทำนุบำรุงศิลปวัฒนธรรม",
];

// export const DATA_YEARS: string[] = ["2567", "2566", "2565", "2564"]
export const DATA_YEARS: string[] = Array.from(
  { length: 6 },
  (_, index) => String(new Date().getFullYear() + 543 + index),
)
export const DATA_TYPES: IndicatorDataType[] = [
  "ปริมาณ",
  "ร้อยละ",
  "สัดส่วน",
  "ค่าเฉลี่ย",
];

export const TARGET_CONDITIONS: TargetCondition[] = [
  "มากกว่าหรือเท่ากับ",
  "น้อยกว่าหรือเท่ากับ",
  "เท่ากับ",
  "อยู่ในช่วง",
];

export const COLLECTION_PERIODS: CollectionPeriod[] = ["ปีการศึกษา"];
