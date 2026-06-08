'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Bell, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 shadow bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="เปิดเมนู"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-medium text-foreground">ผศ.ดร.อธิการบดี</p>
            <p className="text-xs text-muted-foreground">ผู้บริหารระดับสูง</p>
          </div>
          <Avatar className="size-9">
            <AvatarFallback className="bg-accent text-sm font-medium text-primary">
              อธ
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
