export interface User {
  id: string
  name: string
  departmentId: string
}

export const users: User[] = [
  { id: "user-01", name: "ดร.สมชาย ใจดี", departmentId: "dept-01" },
  { id: "user-02", name: "รศ.ดร.สุดารัตน์ พงษ์ไพบูลย์", departmentId: "dept-02" },
  { id: "user-03", name: "ผศ.ดร.วิชัย ตั้งมั่น", departmentId: "dept-03" },
  { id: "user-04", name: "นพ.ธีระพงษ์ แสงทอง", departmentId: "dept-04" },
  { id: "user-05", name: "ดร.อรอุมา ศรีสุข", departmentId: "dept-05" },
  { id: "user-06", name: "ผศ.มานพ เจริญพร", departmentId: "dept-06" },
  { id: "user-07", name: "นางสาวพิมพ์ชนก รักเรียน", departmentId: "dept-07" },
  { id: "user-08", name: "นายกิตติศักดิ์ มั่นคง", departmentId: "dept-08" },
  { id: "user-09", name: "นางวิภาวี สุขสันต์", departmentId: "dept-09" },
  { id: "user-10", name: "ดร.ประภาส วงศ์เจริญ", departmentId: "dept-10" },
]
