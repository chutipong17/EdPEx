import { z } from "zod";

const mobileNumberRegex = /^[0-9]{9,10}$/;

export const SignUpDto = z.object({
  // department: z.number({ error: "กรุณาเลือกสังกัด", }).min(1, { message: "กรุณาเลือกสังกัด" }),
  department: z.number().nullish().transform((value) => value ?? undefined),
  role: z.number({ error: "กรุณากำหนดสิทธิใช้งานระบบ", }).min(1, { message: "กรุณากำหนดสิทธิใช้งานระบบ" }),
  firstName: z.string({ error: "กรุณากรอกชื่อ", }).min(1, { message: "กรุณากรอกชื่อให้ถูกต้อง" }).max(255, { message: "ชื่อต้องไม่เกิน 255 ตัวอักษร" }),
  lastName: z.string().nullish().transform((value) => value ?? undefined),
  email: z.string({ error: "กรุณากรอกอีเมล", }).email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }).max(255, { message: "อีเมลต้องไม่เกิน 255 ตัวอักษร" }),
  mobileNumber: z.string({ error: "กรุณากรอกเบอร์โทรศัพท์", }).trim().min(1, { message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง" }).regex(mobileNumberRegex, { message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก" }),
  userName: z.string({ error: "กรุณากรอกชื่อผู้ใช้", }).min(1, { message: "กรุณากรอกชื่อผู้ใช้ให้ถูกต้อง" }).max(255, { message: "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร" }),
  password: z.string({ error: "กรุณากรอกรหัสผ่าน", }).min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" })
});

export type SignUpDto = z.infer<typeof SignUpDto>;
