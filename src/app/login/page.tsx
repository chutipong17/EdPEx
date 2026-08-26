import { LoginForm } from '@/components/auth/login-form'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function LoginPage() {
    const session = await auth()
    // console.log("Session Login Page ==",session);
    
    switch (session?.user?.role) {
  case 'ADMIN':
  case 'EXECUTIVE':
    redirect('/')
  case 'USER':
    redirect('/my-indicators')
}
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 ">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            Ed
          </div>
          <h1 className="text-2xl font-semibold text-foreground">EdPEx</h1>
          <p className="text-sm text-muted-foreground text-balance">
            ระบบส่งผลลัพธ์ตัวชี้วัด สำหรับผู้ใช้งาน
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>

        {/* <div className="mt-4 rounded-2xl border border-border bg-card/60 p-4 text-xs text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">บัญชีทดสอบ</p>
          <p>ผู้ใช้ 1: user01 / user01</p>
          <p>ผู้ใช้ 2: user02 / user02</p>
        </div> */}
      </div>
    </main>
  )
}
