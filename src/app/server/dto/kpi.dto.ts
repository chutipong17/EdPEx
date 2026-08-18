import { z } from "zod";

const KpiComparison = z.object({
  id: z.number().optional(),
  seq: z.number().int(),
  name: z.string().max(255),
  result: z.string().max(255).optional(),
});

export const KpiDto = z.object({
  kpiCategoryId: z.number({ error: "กรุณากรอกประเภทตัวชี้วัด", }).min(1, { message: "กรุณากรอกประเภทตัวชี้วัดให้ถูกต้อง" }).int(),
  departmentId: z.number({ error: "กรุณากรอกสังกัด", }).min(1, { message: "กรุณากรอกสังกัดให้ถูกต้อง" }).int(),
  monthOfDeliveryId: z.number({ error: "กรุณากรอกเดือนที่ส่งมอบ", }).min(1, { message: "กรุณากรอกเดือนที่ส่งมอบให้ถูกต้อง" }).int(),
  frequencyId: z.number({ error: "กรุณากรอกระยะเวลาการเก็บข้อมูล", }).min(1, { message: "กรุณากรอกระยะเวลาการเก็บข้อมูลให้ถูกต้อง" }).int(),
  targetConditionId: z.number({ error: "กรุณากรอกเงื่อนไขเป้าหมาย", }).min(1, { message: "กรุณากรอกเงื่อนไขเป้าหมายให้ถูกต้อง" }).int(),
  userId: z.number({ error: "กรุณากรอกผู้รับผิดชอบ", }).min(1, { message: "กรุณากรอกผู้รับผิดชอบให้ถูกต้อง" }).int(),

  kpiCode: z
    .string()
    .min(1, "กรุณาระบุรหัส KPI")
    .max(255, "รหัส KPI ต้องไม่เกิน 255 ตัวอักษร"),

  kpiName: z
    .string()
    .min(1, "กรุณาระบุชื่อ KPI")
    .max(255, "ชื่อ KPI ต้องไม่เกิน 255 ตัวอักษร"),

  description: z
    .string()
    .nullable()
    .optional(),

  unit: z
    .string()
    .min(1, "กรุณาระบุหน่วย")
    .max(100, "หน่วยต้องไม่เกิน 100 ตัวอักษร"),

  targetValue: z
    .number()
    .min(1, "กรุณาระบุค่าเป้าหมาย")
    .max(100, "ค่าเป้าหมายต้องไม่เกิน 100 ตัวอักษร"),

  year: z
    .number()
    .int()
    .min(1900, "กรุณากรอกปีให้ถูกต้อง")
    .max(3000, "กรุณากรอกปีให้ถูกต้อง"),

  remark: z
    .string()
    .nullable()
    .optional(),

  kpiComparison: z.array(KpiComparison).optional(),
});

export type KpiDto = z.infer<typeof KpiDto>;
