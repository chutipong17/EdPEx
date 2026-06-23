import { z } from "zod"

export const collectorSchema = z.object({
  name: z.string(),
  result: z.string(),
})

export const indicatorFormSchema = z.object({
  // Section 1 - ข้อมูลพื้นฐาน
  year: z.string().min(1, "กรุณาเลือกปีข้อมูล"),
  indicatorType: z.string().min(1, "กรุณาเลือกประเภทตัวชี้วัด"),
  code: z.string().min(1, "กรุณากรอกรหัสตัวชี้วัด"),
  name: z.string().min(1, "กรุณากรอกชื่อตัวชี้วัด"),

  // Section 2 - ข้อมูลเป้าหมาย
  targetCondition: z.string().min(1, "กรุณาเลือกเงื่อนไขเป้าหมาย"),
  target: z
    .string()
    .min(1, "กรุณากรอกเป้าหมาย")
    .refine(
      (v) => !Number.isNaN(Number(v)),
      "เป้าหมายต้องเป็นตัวเลข"
    ),
  unit: z.string().min(1, "กรุณากรอกหน่วยนับ"),
  collectionPeriod: z.string().min(
    1,
    "กรุณาเลือกระยะเวลาการเก็บข้อมูล"
  ),

  // Section 3 - การส่งมอบ
  months: z.array(z.string()).min(
    1,
    "กรุณาเลือกอย่างน้อย 1 เดือน"
  ),

  // Section 4 - กำหนดผู้รับผิดชอบ
  department: z.string().min(
    1,
    "กรุณาเลือกหน่วยงานผู้รับผิดชอบ"
  ),
  owner: z.string().min(
    1,
    "กรุณาเลือกผู้รับผิดชอบ"
  ),

  // Section 5 - กำหนดค่าเก็บ
  collectors: z.array(collectorSchema).length(6),
})

export type IndicatorFormValues =
  z.infer<typeof indicatorFormSchema>

export const emptyCollectors: {
  name: string
  result: string
}[] = Array.from({ length: 6 }, () => ({
  name: "",
  result: "",
}))

export const defaultFormValues: IndicatorFormValues = {
  year: "",
  indicatorType: "",
  code: "",
  name: "",
  targetCondition: "",
  target: "",
  unit: "",
  collectionPeriod: "",
  months: [],
  department: "",
  owner: "",
  collectors: emptyCollectors,
}