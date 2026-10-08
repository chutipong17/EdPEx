export interface KpiComparison {
  id: number;
  kpiId: number;
  seq: number;
  name: string;
  result: string | null;
  isDeleted: boolean;
}

export interface KpiSubmissionStatus {
  id: number;
  name: string;
  description: string;
}

export interface KpiSubmission {
  id: number;
  kpiAssignmentId: number;
  statusId: number;
  submittedBy: number | null;
  submittedDate: string | null;
  description: string | null;
  actualValue: number | null;
  calculatedScore: number | null;
  achievementPercent: number | null;
  isDeleted: boolean;
  status: KpiSubmissionStatus;
}

export interface KpiAssignment {
  id: number;
  userId: number;
  kpiId: number;
  assignedDate: string;
  dueDate: string | null;
  isDeleted: boolean;
  kpiSubmission: KpiSubmission[];
}

export interface KpiCategory {
  id: number;
  categoryName: string;
  isDeleted: boolean;
}

export interface Frequency {
  id: number;
  frequencyName: string;
  isDeleted: boolean;
}

export interface MonthOfDelivery {
  id: number;
  name: string;
  value: string;
}

export interface TargetCondition {
  id: number;
  conditionName: string;
  description: string;
}

export interface Department {
  id: number;
  organizationId: number;
  departmentCode: string | null;
  departmentName: string;
  isDeleted: boolean;
}

export interface KpiUser {
  id: number;
  departmentId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface KpiTarget {
  id: number;
  kpiId: number;
  userId: number;
  departmentId: number;
  isDeleted: boolean;
  department: Department;
  user: KpiUser;
}

export interface KpiApi {
  id: number;
  kpiCategoryId: number;
  monthOfDeliveryId: number;
  frequencyId: number;
  targetConditionId: number;

  kpiCode: string;
  kpiName: string;
  description: string | null;
  unit: string | null;

  year: number;
  targetValue: string | number | null;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  kpiCategory: KpiCategory;
  frequency: Frequency;
  monthOfDelivery: MonthOfDelivery;
  targetCondition: TargetCondition;

  kpiComparison: KpiComparison[];

  kpiAssignment: KpiAssignment[];

  kpiTarget: KpiTarget[];

  userId: number;
  firstName: string;
  lastName: string;

  departmentId: number;
  departmentName: string;

  kpiSubmissionStatus: string;
}