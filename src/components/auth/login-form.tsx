'use client'

import { useActionState } from 'react'
import { AlertCircle, LogIn } from 'lucide-react'
import { login } from '@/app/actions/auth'
import type { LoginState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: LoginState = {}

export function LoginForm() {
  const [state, formAction, pending] = useActionState<
    LoginState,
    FormData
  >(login, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500"
        >
          <AlertCircle className="size-4" />
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="username">ชื่อผู้ใช้</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          placeholder="user01"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">รหัสผ่าน</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••"
          required
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full gap-2">
        <LogIn className="size-4" />
        {pending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </Button>
    </form>
  )
}