import { z } from "zod";

export const DepartmentDto = z.object({
  departmentName: z.string({ error: "กรุณากรอกชื่อสังกัด", }).min(1, { message: "กรุณากรอกชื่อสังกัดให้ถูกต้อง" }).max(255, { message: "ชื่อสังกัดต้องไม่เกิน 255 ตัวอักษร" }),
  departmentCode: z.string().nullish().transform((value) => value ?? undefined),
});

export type DepartmentDto = z.infer<typeof DepartmentDto>;
