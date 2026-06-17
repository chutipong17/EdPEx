"use client"

import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="สลับการแสดงเมนู"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
          ซ่อนเมนู
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">ADMIN</span>
        <Avatar className="size-9">
          <AvatarFallback className="bg-secondary text-primary">
            <User className="size-5" aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
