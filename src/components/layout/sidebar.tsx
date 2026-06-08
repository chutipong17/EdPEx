'use client'

import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LayoutDashboard, BarChart3, Settings2, Users, LogOut, GraduationCap } from 'lucide-react'

export interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  key: string
}

export const navItems: NavItem[] = [
  { label: 'Dashboard สำหรับผู้บริหาร', icon: LayoutDashboard, key: 'dashboard' },
  { label: 'ภาพรวมผลลัพธ์', icon: BarChart3, key: 'results' },
  { label: 'บริหารจัดการ', icon: Settings2, key: 'manage' },
  { label: 'ผู้มีส่วนได้ส่วนเสีย', icon: Users, key: 'stakeholders' },
]

interface SidebarProps {
  collapsed?: boolean
  activeKey?: string
  onNavigate?: (key: string) => void
}

export function SidebarLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div
      className={cn(
        'flex h-[72px] items-center gap-3  border-sidebar-border px-5',
        collapsed && 'justify-center px-0',
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <GraduationCap className="size-6" aria-hidden="true" />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-sidebar-foreground">EdPEx</span>
          <span className="text-[11px] text-muted-foreground">Excellence System</span>
        </div>
      )}
    </div>
  )
}

export function SidebarNav({
  collapsed,
  activeKey = 'dashboard',
  onNavigate,
}: SidebarProps) {
  return (
    <TooltipProvider delay={100}>
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3" aria-label="เมนูหลัก">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.key === activeKey
          const buttonClass = cn(
            'flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            collapsed && 'justify-center px-0',
            active
              ? 'bg-accent text-primary'
              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
          )

          if (collapsed) {
            return (
              <Tooltip key={item.key}>
                <TooltipTrigger
                  onClick={() => onNavigate?.(item.key)}
                  aria-current={active ? 'page' : undefined}
                  className={buttonClass}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate?.(item.key)}
              aria-current={active ? 'page' : undefined}
              className={buttonClass}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="truncate text-left">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}

export function SidebarFooter({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="p-3">
      <button
        type="button"
        className={cn(
          'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
        aria-label="ออกจากระบบ"
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        {!collapsed && <span>ออกจากระบบ</span>}
      </button>
    </div>
  )
}

/** Desktop / collapsed sidebar (fixed) */
export function Sidebar({ collapsed, activeKey, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden flex-col shadow border-sidebar-border bg-sidebar lg:flex',
        collapsed ? 'w-20' : 'w-[260px]',
      )}
    >
      <SidebarLogo collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} activeKey={activeKey} onNavigate={onNavigate} />
      <SidebarFooter collapsed={collapsed} />
    </aside>
  )
}

/** Content for the mobile Sheet drawer */
export function SidebarMobileContent({ activeKey, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <SidebarLogo />
      <SidebarNav activeKey={activeKey} onNavigate={onNavigate} />
      <SidebarFooter />
    </div>
  )
}
