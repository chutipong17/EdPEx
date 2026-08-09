import { NextResponse } from 'next/server'
// import { mockDepartments } from '@/lib/mock-department'
import { departmentSchema } from '@/lib/department-schema'

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/department`,
      {
        cache: "no-store",
      }
    );
    console.log("GET DEPARTMENT === yes");
    
    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      {
        message: "ไม่สามารถดึงข้อมูล Department ได้"
      },
      {
        status: 500
      }
    );
  }
}

export async function POST(request: Request) {

  const body = await request.json()

  const parsed = departmentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "ข้อมูลไม่ถูกต้อง"
      },
      {
        status:400
      }
    )
  }


   const token = request.headers.get("authorization");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/department`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );


  const data = await response.json();

  console.log("DEPARTMENT ===", data);
  

  return NextResponse.json(
    data,
    {
      status:201
    }
  )
}

// export async function POST(request: Request) {
//   const body = await request.json().catch(() => null)
//   const parsed = departmentSchema.safeParse(body)

//   if (!parsed.success) {
//     return NextResponse.json(
//       { message: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' },
//       { status: 400 },
//     )
//   }

//   const now = new Date().toISOString()
//   const nextId =
//     mockDepartments.reduce((max, dept) => Math.max(max, dept.id), 0) + 1

//   const department = {
//     id: nextId,
//     name: parsed.data.name,
//     createdAt: now,
//     updatedAt: now,
//   }

//   mockDepartments.push(department)

//   return NextResponse.json(department, { status: 201 })
// }
