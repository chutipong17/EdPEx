export type UserRole = 'ADMIN' | 'USER' | 'MANAGER'

export interface User {
  id: number
  username: string
  fullname: string
  email: string
  department: string
  phone: string
  role: UserRole
}

export const DEPARTMENTS = [
  'สำนักงานอธิการบดี',
  'คณะวิศวกรรมศาสตร์',
  'คณะวิทยาศาสตร์',
  'คณะแพทยศาสตร์',
  'คณะบริหารธุรกิจ',
  'สำนักวิทยบริการและเทคโนโลยีสารสนเทศ',
  'กองนโยบายและแผน',
] as const

export const ROLES: { label: string; value: UserRole }[] = [
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'USER', value: 'USER' },
  { label: 'MANAGER', value: 'MANAGER' },
]
