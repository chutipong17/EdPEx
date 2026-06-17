"use client";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  BarChart3,
  Settings2,
  Users,
  LogOut,
  GraduationCap,
  ChevronDown,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: any;
  key: string;
  href?: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard สำหรับผู้บริหาร",
    icon: LayoutDashboard,
    key: "dashboard",
    href: "/",
  },
  {
    label: "ภาพรวมผลลัพธ์",
    icon: BarChart3,
    key: "results",
    href: "admin/results",
  },
  {
    label: "บริหารจัดการ",
    icon: Settings2,
    key: "manage",
    children: [
      {
        label: "จัดการผู้ใช้งาน",
        icon: Users,
        key: "manage-users",
        href: "/manage/users",
      },
      {
        label: "จัดการหน่วยงาน",
        icon: Settings2,
        key: "manage-departments",
        href: "/manage/departments",
      },
      {
        label: "จัดการเกณฑ์ EdPEx",
        icon: Settings2,
        key: "manage-criteria",
        href: "/manage/criteria",
      },
    ],
  },
  {
    label: "รายการตัวชี้วัด",
    icon: Users,
    key: "stakeholders",
    href: "/stakeholders",
  },
];

interface SidebarProps {
  collapsed?: boolean;
  activeKey?: string;
  onNavigate?: (key: string) => void;
}

export function SidebarLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[72px] items-center gap-3 border-sidebar-border px-5",
        collapsed && "justify-center px-0",
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <GraduationCap className="size-6" />
      </div>

      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-sidebar-foreground">
            EdPEx
          </span>
          <span className="text-[11px] text-muted-foreground">
            Excellence System
          </span>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({
  collapsed,
  activeKey = "dashboard",
  onNavigate,
}: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>(["manage"]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <TooltipProvider delay={100}>
      <nav
        className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3"
        aria-label="เมนูหลัก"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.key === activeKey;

          const buttonClass = cn(
            "flex h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200",
            collapsed && "justify-center px-0",
            active
              ? "bg-accent text-primary"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          );

          // ===== MENU ที่มี SUBMENU =====
          if (item.children?.length) {
            const isOpen = openMenus.includes(item.key);

            return (
              <div key={item.key}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.key)}
                  className={cn(buttonClass, !collapsed && "justify-between")}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {!collapsed && (
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  )}
                </button>

                {!collapsed && isOpen && (
                  <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-border pl-3">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.key}
                        href={sub.href || "#"}
                        onClick={() => onNavigate?.(sub.key)}
                        className={cn(
                          "flex h-10 items-center rounded-lg px-3 text-sm transition-colors",
                          activeKey === sub.key
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // ===== COLLAPSED =====
          if (collapsed) {
            return (
              <Tooltip key={item.key}>
                <TooltipTrigger>
                  <Link
                    href={item.href || "#"}
                    onClick={() => onNavigate?.(item.key)}
                    className={buttonClass}
                  >
                    <Icon className="size-5 shrink-0" />
                  </Link>
                </TooltipTrigger>

                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          // ===== MENU ปกติ =====
          return (
            <Link
              key={item.key}
              href={item.href || "#"}
              onClick={() => onNavigate?.(item.key)}
              className={buttonClass}
            >
              <Icon className="size-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}

export function SidebarFooter({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="p-3">
      <button
        type="button"
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90",
        )}
      >
        <LogOut className="size-4 shrink-0" />
        {!collapsed && <span>ออกจากระบบ</span>}
      </button>
    </div>
  );
}

export function Sidebar({ collapsed, activeKey, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-sidebar-border bg-sidebar shadow lg:flex",
        collapsed ? "w-20" : "w-[260px]",
      )}
    >
      <SidebarLogo collapsed={collapsed} />

      <SidebarNav
        collapsed={collapsed}
        activeKey={activeKey}
        onNavigate={onNavigate}
      />

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

export function SidebarMobileContent({ activeKey, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <SidebarLogo />

      <SidebarNav activeKey={activeKey} onNavigate={onNavigate} />

      <SidebarFooter />
    </div>
  );
}
