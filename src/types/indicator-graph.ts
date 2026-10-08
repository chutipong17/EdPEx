export interface IndicatorDataPoint {
  year: string;
  target: number | null;

  /**
   * key จะมาจาก kpiComparison.name
   * เช่น
   * KKU: 80
   * UUU: 70
   */
  [key: string]: string | number | null;
}

export interface IndicatorGraph {
  id: string;

  /** เช่น 7.ก */
  code: string;

  /** ชื่อตัวชี้วัด */
  description: string;

  /** id ของประเภทตัวชี้วัด */
  category: string;

  /** ข้อมูลสำหรับแสดงกราฟ */
  data: IndicatorDataPoint[];
}

export interface FilterState {
  year: string | null;
  category: string | null;
  chartType: string | null;
  search: string | null;
}