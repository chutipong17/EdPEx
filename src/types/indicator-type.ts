export interface IndicatorType {
  // id: number
  // name: string
  // createdAt: string
  // updatedAt: string
   id:number;
  categoryName:string;
  isDeleted:boolean;
  createdAt:string;
  updatedAt:string;
  createdBy:string;
  updatedBy:string;
}

export interface IndicatorTypeInput {
  name: string
}
