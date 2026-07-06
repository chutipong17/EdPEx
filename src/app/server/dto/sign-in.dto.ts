import { z } from "zod";

export const SignInDto = z.object({
  userName: z.string({ error: "กรุณากรอกชื่อผู้ใช้", }).min(1, { message: "กรุณากรอกชื่อผู้ใช้ให้ถูกต้อง" }).max(255, { message: "ชื่อผู้ใช้ต้องไม่เกิน 255 ตัวอักษร" }),
  password: z.string({ error: "กรุณากรอกรหัสผ่าน", }).min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" })
});

export type SignInDto = z.infer<typeof SignInDto>;
