export type UserRole = 'ADMIN' | 'USER' | 'EXECUTIVE'

export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  department: string
  mobileNumber: string
  role: UserRole
  roleNameTh: string
  roleNameEn: string
  roleCode: UserRole
  departmentName: string
  roleId: number
  departmentId: number
}
     

// export const DEPARTMENTS = [
//   'สำนักงานอธิการบดี',
//   'คณะวิศวกรรมศาสตร์',
//   'คณะวิทยาศาสตร์',
//   'คณะแพทยศาสตร์',
//   'คณะบริหารธุรกิจ',
//   'สำนักวิทยบริการและเทคโนโลยีสารสนเทศ',
//   'กองนโยบายและแผน',
// ] as const

export const ROLES: { label: string; value: UserRole }[] = [
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'USER', value: 'USER' },
  { label: 'EXECUTIVE', value: 'EXECUTIVE' },
]
