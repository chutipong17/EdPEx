export type KpiCategory = {
  id: number;
  categoryName: string;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
};

export interface KpiComparison {
  seq: number;
  name: string;
  result: string;
}
export interface montOfDeliveryData{
   id: number
   name:string
   value: string
}
export interface Kpi {
  kpiCategoryId: number;
  departmentId: number;
  monthOfDeliveryId: number;
  frequencyId: number;
  targetConditionId: number;
  userId: number;
  departmentName:string
  monthOfDelivery:montOfDeliveryData[]
  
  kpiCode: string;
  kpiName: string;
  description: string;
  unit: string;
  targetValue: number;
  year: number;
  remark: string;

  kpiComparison: KpiComparison[];
  id:number
}