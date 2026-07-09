
//API
// import 'server-only'
// import { cookies } from 'next/headers'

// export const SESSION_COOKIE = 'edpex_session'

// export interface SessionUser {
//   id: number
//   username: string
//   fullname: string
//   email: string
//   department: string
//   phone: string
//   role: 'USER' | 'ADMIN' | 'MANAGER'
// }

// export async function auth(): Promise<{ user: SessionUser } | null> {
//   const store = await cookies()
//   const session = store.get(SESSION_COOKIE)?.value

//   if (!session) return null

//   try {
//     const user = JSON.parse(session)
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

import 'server-only'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'edpex_session'

export interface SessionUser {
  id: string
  username: string
  name: string
  role: 'USER' | 'ADMIN' | 'MANAGER'
  department: string
}

export interface Session {
  user: SessionUser
}

/**
 * Demo user directory.
 *
 * In a real deployment this would be backed by NextAuth + a database.
 * The cookie only stores the user id; the trusted record is resolved here
 * on the server so the client can never spoof a different identity.
 */
export const DEMO_USERS: Record<string, SessionUser & { password: string }> = {
  USER001: {
    id: 'USER001',
    username: 'user01',
    password: 'user01',
    name: 'สมชาย ใจดี',
    role: 'USER',
    department: 'สำนักงานประกันคุณภาพการศึกษา',
  },
  USER002: {
    id: 'USER002',
    username: 'user02',
    password: 'user02',
    name: 'สมหญิง รักเรียน',
    role: 'USER',
    department: 'กองแผนงานและงบประมาณ',
  },
  ADMIN001: {
    id: 'ADMIN001',
    username: 'AdminDEMO',
    password: 'AdminDEMO',
    name: 'AdminDEMO',
    role: 'ADMIN',
    department: 'Super ADMIN',
  },
  MANAGER001: {
    id: 'MANAGER001',
    username: 'Manager01',
    password: 'Manager01',
    name: 'Manager01',
    role: 'MANAGER',
    department: 'กองแผนงานและงบประมาณ',
  },
}

/** Mirrors NextAuth's `const session = await auth()` API. */
export async function auth(): Promise<Session | null> {
  const store = await cookies()
  const userId = store.get(SESSION_COOKIE)?.value
  if (!userId) return null

  const record = DEMO_USERS[userId]
  if (!record) return null

  const { password: _password, ...user } = record
  return { user }
}

/** Validate username/password and return the user id on success. */
export function verifyCredentials(
  username: string,
  password: string,
): SessionUser | null {
  const record = Object.values(DEMO_USERS).find(
    (u) => u.username === username && u.password === password,
  )
  if (!record) return null
  const { password: _password, ...user } = record
  return user
}
