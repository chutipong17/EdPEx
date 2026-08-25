export interface Department {
  id: number
  departmentName: string
  departmentCode?: string | null;
  createdAt: string
  updatedAt: string
}

export interface DepartmentInput {
  departmentName: string
}
