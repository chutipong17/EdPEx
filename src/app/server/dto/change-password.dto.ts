import { z } from "zod";

export const ChangePasswordDto = z.object({
  userId: z.number({ error: "กรุณากรอก ID ผู้ใช้", }).min(1, { message: "กรุณากรอก ID ผู้ใช้ให้ถูกต้อง" }),
  password: z.string({ error: "กรุณากรอกรหัสผ่าน", }).min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" }),
  confirmPassword: z.string({ error: "กรุณากรอกยืนยันรหัสผ่าน", }).min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" })
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordDto>;
