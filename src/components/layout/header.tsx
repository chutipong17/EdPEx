
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { SessionUser } from '@/lib/auth'
interface HeaderProps {
  onToggleSidebar: () => void,
   user: SessionUser
}

export function Header({ onToggleSidebar,user}: HeaderProps) {
  // const initials = user.name.trim().charAt(0) || 'U'
    const initials =
    user?.firstName?.trim()?.charAt(0)?.toUpperCase() || 'U'
   
    
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="สลับการแสดงเมนู"
          className=" hover:bg-transparent
    hover:text-inherit
    focus:bg-transparent
    active:bg-transparent
    shadow-none"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
          ซ่อนเมนู
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-semibold">{user?.firstName ?? '-'}</p>
          <p className="text-xs text-muted-foreground"> {user?.departmentName ?? '-'}</p>
        </div>
        <Avatar className="size-9 border">
          <AvatarFallback className="bg-accent text-sm font-semibold text-primary">
           {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
