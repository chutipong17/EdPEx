import { z } from 'zod'

const phoneRegex = /^[0-9]{9,10}$/

export const addUserSchema = z
  .object({
    department: z.string().min(1, 'กรุณาเลือกหน่วยงานที่รับผิดชอบ'),
    firstName: z.string().min(1, 'กรุณากรอกชื่อผู้รับผิดชอบ'),
    lastName: z.string().min(1, 'กรุณากรอกนามสกุลผู้รับผิดชอบ'),
    role: z.string().min(1, 'กรุณากำหนดสิทธิ์เข้าใช้งานระบบ'),
    // role: z.enum(['ผู้ดูแลระบบ', 'ผู้ใช้งาน', 'ผู้บริหาร'], {
    //   message: 'กรุณากำหนดสิทธิ์เข้าใช้งานระบบ',
    // }),
    email: z
      .string()
      .min(1, 'กรุณากรอกอีเมล')
      .email('รูปแบบอีเมลไม่ถูกต้อง'),
    mobileNumber: z
      .string()
      .min(1, 'กรุณากรอกเบอร์โทรศัพท์')
      .regex(phoneRegex, 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก'),
    username: z.string().min(1, 'กรุณากรอกชื่อผู้ใช้'),
    password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
    confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่าน'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  })

export type AddUserValues = z.infer<typeof addUserSchema>

export const editUserSchema = z.object({
  department: z.string().min(1, 'กรุณาเลือกหน่วยงานที่รับผิดชอบ'),
   firstName: z.string().min(1, 'กรุณากรอกชื่อผู้รับผิดชอบ'),
    lastName: z.string().min(1, 'กรุณากรอกนามสกุลผู้รับผิดชอบ'),
   role: z.string().min(1, 'กรุณากำหนดสิทธิ์เข้าใช้งานระบบ'),
  // role: z.enum(['ADMIN', 'USER', 'EXECUTIVE'], {
  //   message: 'กรุณากำหนดสิทธิ์เข้าใช้งานระบบ',
  // }),
  email: z.string().min(1, 'กรุณากรอกอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง'),
  mobileNumber: z
    .string()
    .min(1, 'กรุณากรอกเบอร์โทรศัพท์')
    .regex(phoneRegex, 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก'),
  username: z.string().min(1, 'กรุณากรอกชื่อผู้ใช้'),
  roleId: z.number().min(1, 'กรุณาเลือกสิทธิ์เข้าใช้งานระบบ'),
  departmentId: z.number().min(1, 'กรุณาเลือกหน่วยงานที่รับผิดชอบ'),
})

export type EditUserValues = z.infer<typeof editUserSchema>

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
    confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่าน'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
