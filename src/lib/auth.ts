
//API
import 'server-only'
import { cookies } from 'next/headers'
import axios from "axios";
import axiosInstance from "@/lib/axios"
export const SESSION_COOKIE = 'edpex_session'

export interface SessionUser {
  id: number
  firstName: string
  lastName: string
  email: string
  department: string
  phone: string
  role: 'USER' | 'ADMIN' | 'EXECUTIVE'
}

//   id: string
//   username: string
//   name: string
//   role: 'USER' | 'ADMIN' |"MANAGER"
//   department: string
// }
export async function auth(): Promise<{ user: SessionUser } | null> {
  const store = await cookies()
  const session = store.get(SESSION_COOKIE)?.value

  if (!session) return null

  try {
    const user = JSON.parse(session)
    return { user }
  } catch {
    return null
  }
}

export async function verifyCredentials(
  userName: string,
  password: string
): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        password,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      return null;
    }

    const user = result.data;
    console.log("reSULT === ",result);
    

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: `${user.firstName} ${user.lastName ?? ""}`.trim(),
      email: user.email,
      department: "",
      phone: "",
      role:
        user.rolePermission?.[0]?.roleId === 1
          ? "ADMIN"
          : user.rolePermission?.[0]?.roleId === 2
          ? "EXECUTIVE"
          : "USER",
    };
  } catch (error) {
    console.error("ERROR ",error);
    return null;
  }
}

// export async function verifyCredentials(
//   userName: string,
//   password: string
// ): Promise<SessionUser | null> {
//   try {
//     const { data } = await axiosInstance.post("/api/auth/sign-in", {
//       userName,
//       password,
//     });

//     if (!data.success) {
//       return null;
//     }

//     const user = data.data;

//     let role: SessionUser["role"] = "USER";

//     switch (user.rolePermission?.[0]?.roleId) {
//       case 1:
//         role = "ADMIN";
//         break;
//       case 2:
//         role = "EXECUTIVE";
//         break;
//       default:
//         role = "USER";
//     }

//     return {
//       id: user.id ?? 0,
//       username: user.username ?? user.email,
//       fullname: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
//       email: user.email,
//       department: user.department ?? "",
//       phone: user.phone ?? "",
//       role,
//     };
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }



// export async function verifyCredentials(
//   userName: string,
//   password: string
// ): Promise<SessionUser | null> {
//    try {
//     const response = await axiosInstance.post("/api/auth/sign-in", {
//       userName,
//       password,
//     });

//     if (!response.data.success) {
//       return null;
//     }

//     return response.data.data as SessionUser;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Status:", error.response?.status);
//       console.error("Data:", error.response?.data);
//       console.error("Message:", error.message);
//     } else {
//       console.error(error);
//     }

//     return null;
//   }

// //     try {
// //   const response = await axiosInstance.post(
// //     '/api/auth/sign-in',
// //     JSON.stringify({
// //       userName,
// //       password,
// //     })
// //   );

// //   return response.data;
// // } catch (error) {
// //   if (axios.isAxiosError(error)) {
// //     console.error("Status:", error.response?.status);
// //     console.error("Data:", error.response?.data);
// //     console.error("Message:", error.message);
// //   } else {
// //     console.error(error);
// //   }

// //   throw error;
// // }
    
  
 
// }

// export interface SessionUser {
//   id: string
//   username: string
//   name: string
//   role: 'USER' | 'ADMIN' |"MANAGER"
//   department: string
// }

// export interface Session {
//   user: SessionUser
// }


// export const DEMO_USERS: Record<string, SessionUser & { password: string }> = {
//   USER001: {
//     id: 'USER001',
//     username: 'user01',
//     password: 'user01',
//     name: 'สมชาย ใจดี',
//     role: 'USER',
//     department: 'สำนักงานประกันคุณภาพการศึกษา',
//   },
//   USER002: {
//     id: 'USER002',
//     username: 'user02',
//     password: 'user02',
//     name: 'สมหญิง รักเรียน',
//     role: 'USER',
//     department: 'กองแผนงานและงบประมาณ',
//   },
// }




// export async function auth(): Promise<{ user: SessionUser } | null> {
//   const store = await cookies()
//   const session = store.get(SESSION_COOKIE)?.value

//   if (!session) return null

//   try {
//     const user = JSON.parse(session) as SessionUser
//     return { user }
//   } catch {
//     return null
//   }
// }


// export async function verifyCredentials(
//   username: string,
//   password: string
// ): Promise<SessionUser | null> {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       }
//     )

//     const result = await res.json()

//     if (!res.ok) return null

//     return result.data
//   } catch {
//     return null
//   }
// }

// import 'server-only'
// import { cookies } from 'next/headers'

// export const SESSION_COOKIE = 'edpex_session'

// export interface SessionUser {
//   id: string
//   username: string
//   name: string
//   role: 'USER' | 'ADMIN' | 'EXECUTIVE'
//   department: string
// }

// export interface Session {
//   user: SessionUser
// }

// /**
//  * Demo user directory.
//  *
//  * In a real deployment this would be backed by NextAuth + a database.
//  * The cookie only stores the user id; the trusted record is resolved here
//  * on the server so the client can never spoof a different identity.
//  */
// export const DEMO_USERS: Record<string, SessionUser & { password: string }> = {
//   USER001: {
//     id: 'USER001',
//     username: 'user01',
//     password: 'user01',
//     name: 'สมชาย ใจดี',
//     role: 'USER',
//     department: 'สำนักงานประกันคุณภาพการศึกษา',
//   },
//   USER002: {
//     id: 'USER002',
//     username: 'user02',
//     password: 'user02',
//     name: 'สมหญิง รักเรียน',
//     role: 'USER',
//     department: 'กองแผนงานและงบประมาณ',
//   },
//   ADMIN001: {
//     id: 'ADMIN001',
//     username: 'AdminDEMO',
//     password: 'AdminDEMO',
//     name: 'AdminDEMO',
//     role: 'ADMIN',
//     department: 'Super ADMIN',
//   },
//   MANAGER001: {
//     id: 'MANAGER001',
//     username: 'Manager01',
//     password: 'Manager01',
//     name: 'Manager01',
//     role: 'EXECUTIVE',
//     department: 'กองแผนงานและงบประมาณ',
//   },
// }

// /** Mirrors NextAuth's `const session = await auth()` API. */
// export async function auth(): Promise<Session | null> {
//   const store = await cookies()
//   const userId = store.get(SESSION_COOKIE)?.value
//   if (!userId) return null

//   const record = DEMO_USERS[userId]
//   if (!record) return null

//   const { password: _password, ...user } = record
//   return { user }
// }

// /** Validate username/password and return the user id on success. */
// export function verifyCredentials(
//   username: string,
//   password: string,
// ): SessionUser | null {
//   const record = Object.values(DEMO_USERS).find(
//     (u) => u.username === username && u.password === password,
//   )
//   if (!record) return null
//   const { password: _password, ...user } = record
//   return user
// }
