export type IndicatorStatus =
  | "Pending"
  | "Submitted"
  | "warning";

export interface Indicator {
  id: string;
  year: string;
  code: string;
  name: string;
  department: string;
  owner: string;
  dataType: string;
  target: number;
  unit: string;
  result: number | null;
  status: IndicatorStatus;

  kpiSubmissionStatus?: string | null;

  kpiAssignment?: KpiAssignment[];
}

export interface KpiAssignment {
  id: number;
  userId: number;
  kpiId: number;
  assignedDate: string;
  dueDate: string | null;
  createdAt: string;
  createdBy: string;
  isDeleted: boolean;

  kpiSubmission?: KpiSubmission[];
}

export interface KpiSubmission {
  id: number;
  kpiAssignmentId: number;
  statusId: number;

  submittedBy: string | null;
  achievementPercent: number | null;
  actualValue: string | null;
  calculatedScore: number | null;

  createdAt: string;
  description: string | null;
  isDeleted: boolean;

  submittedDate: string | null;
  updatedAt: string;
  updatedBy: string | null;

  status?: {
    id: number;
    name: string;
    description: string;
  };
}
export interface KpiSummary {
  total: number;
  achieved: number;
  notAchieved: number;
  noData: number;
  
}

export interface PieDatum {
  name: string;
  value: number;
  color: string;
}

export interface AnalysisDatum {
  year: string;
  target: number;

  [key: string]: string | number | null;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface DashboardFilters {
  year: number | null;
  indicatorType: number | null;
  departmentName: number | null;
  branch: string;
}