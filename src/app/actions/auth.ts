// 'use server'

// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// import { SESSION_COOKIE ,verifyCredentials} from '@/lib/auth'

// export interface LoginState {
//   error?: string
// }

// export async function login(
//   _prevState: LoginState,
//   formData: FormData,
// ): Promise<LoginState> {
//   const username = String(formData.get('username') ?? '').trim()
//   const password = String(formData.get('password') ?? '')

//   const user = verifyCredentials(username, password)
//   if (!user) {
//     return { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }
//   }

//   const store = await cookies()
//   store.set(SESSION_COOKIE, user.id, {
//     httpOnly: true,
//     sameSite: 'lax',
//     path: '/',
//     maxAge: 60 * 60 * 8,
//   })
//   // console.log("USER ==",user);

//   if(user.role ==='ADMIN' || user.role === 'EXECUTIVE'){
//    redirect('/')
//   }else{
//     redirect('/my-indicators')
//   }
// }

//API
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifyCredentials } from '@/lib/auth'

export interface LoginState {
  error?: string
}

export async function login(
  _prevState: any,
  formData: FormData
) {

  const username = String(formData.get('username') ?? '')
  const password = String(formData.get('password') ?? '')

  const user = await verifyCredentials(username, password)
   
  if (!user) {
    return { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
  if(user.role === 'ADMIN'){
    redirect('/admin/results')
  }else if(user.role === 'EXECUTIVE'){
   redirect('/')
  }else{
   redirect('/my-indicators')
  }
  
}

// export async function logout() {
//   const store = await cookies()
//   store.delete(SESSION_COOKIE)
//   redirect('/login')
// }


export async function logout() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Logout API Error:", error);
  }

  const store = await cookies();

  store.delete(SESSION_COOKIE);

  redirect("/login");
}