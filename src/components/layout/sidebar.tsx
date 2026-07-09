"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter,usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import {
  LayoutDashboard,
  BarChart3,
  Settings2,
  Users,
  LogOut,
  GraduationCap,
  ChevronDown,
  ChartPie,
  FilePen,
  Building2,
} from "lucide-react";
import { UserRole } from "@/types/user";
import { auth } from "@/lib/auth";
import router from "next/router";
const isMenuActive = (pathname: string, item: NavItem) => {
  // Dashboard (/)
  if (item.href === "/" && pathname === "/") {
    return true;
  }

  // Menu ปกติ
  if (item.href && item.href !== "/") {
    return pathname.startsWith(item.href);
  }

  // Parent Menu
  if (item.children) {
    return item.children.some(
      (child) =>
        child.href &&
        (pathname === child.href || pathname.startsWith(`${child.href}/`)),
    );
  }

  return false;
};
export interface NavItem {
  label: string;
  icon: any;
  key: string;
  href?: string;
  children?: NavItem[];
  roles?: string[];
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard สำหรับผู้บริหาร",
    icon: LayoutDashboard,
    key: "dashboard",
    href: "/",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    label: "ภาพรวมผลลัพธ์",
    icon: BarChart3,
    key: "results",
    href: "/admin/results",
    roles: ["ADMIN"],
  },
  {
    label: "บริหารจัดการ",
    icon: Settings2,
    key: "manage",
    roles: ["ADMIN"],
    children: [
      {
        label: "จัดการเกณฑ์ EdPEx",
        icon: ChartPie,
        key: "manage-indicators",
        href: "/admin/manage/indicators",
      },
      {
        label: "จัดการประเภทตัวชี้วัด",
        icon: FilePen,
        key: "manage-indicators-type",
        href: "/admin/manage/indicators-type",
      },
      {
        label: "จัดการผู้ใช้งาน",
        icon: Users,
        key: "manage-users",
        href: "/admin/manage/users",
      },
      {
        label: "จัดการหน่วยงาน",
        icon: Building2,
        key: "manage-departments",
        href: "/admin/manage/departments",
      },
    ],
  },
  {
    label: "รายการตัวชี้วัด",
    icon: Users,
    key: "indicators",
    href: "/my-indicators",
    roles: ["ADMIN", "USER"],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  activeKey?: string;
  onNavigate?: (key: string) => void;
  role?: UserRole;
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
export function SidebarFooter({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="p-3">
      <form action={logout}>
        <button
          type="submit"
          className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90",
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>ออกจากระบบ</span>}
        </button>
      </form>
      {/* <button
        type="button"
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90",
        )}
        onClick={logout()}
      >
        <LogOut className="size-4 shrink-0" />
        {!collapsed && <span>ออกจากระบบ</span>}
      </button> */}
    </div>
  );
}

export function SidebarNav({ collapsed, onNavigate, role }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const router = useRouter()
  // console.log("pathname == ",role);

const filteredNavItems = navItems.filter((item) => {
if (role === 'ADMIN') return true
    // role check
    const matchRole =
      !item.roles?.length ||
      (role && item.roles.includes(role))

    // href check (optional)
    const matchHref =
      !item.href ||
      pathname.startsWith(item.href)

    return matchRole && matchHref
  })
//   const filteredNavItems = navItems.filter((item) => {
//   // ADMIN เห็นทุกเมนู
//   if (role === 'ADMIN') return true

//   const matchRole =
//     !item.roles?.length ||
//     (role && item.roles.includes(role))

//   return matchRole
// })
  useEffect(() => {
  const parentKeys = navItems
    .filter((item) =>
      item.children?.some(
        (child) =>
          child.href &&
          (pathname === child.href ||
            pathname.startsWith(`${child.href}/`)),
      ),
    )
    .map((item) => item.key);

  setOpenMenus(parentKeys);
}, [pathname, navItems]);



useEffect(() => {
  if (role === "USER" && pathname === "/") {
    router.replace("/my-indicators");
  }
 
  if (role === "MANAGER" && pathname !== "/") {
    router.replace("/");
  }
  
}, [pathname, role]);


  // useEffect(() => {
  //   const parentKeys = navItems
  //     .filter((item) =>
  //       item.children?.some(
  //         (child) =>
  //           child.href &&
  //           (pathname === child.href || pathname.startsWith(`${child.href}/`)),
  //       ),
  //     )
  //     .map((item) => item.key);

  //   setOpenMenus((prev) => [...new Set([...prev, ...parentKeys])]);
  // }, [pathname]);


  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3">
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const active = isMenuActive(pathname, item);

        const buttonClass = cn(
          "flex h-12 items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
          collapsed ? "w-12 justify-center" : "w-full px-3",
          active
            ? "bg-accent text-primary"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        );

        // ====================================
        // MENU ที่มี SUBMENU
        // ====================================
        if (item.children?.length) {
          const isOpen = openMenus.includes(item.key);

          // ---------- COLLAPSED ----------
          if (collapsed) {
            return (
              <div key={item.key} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleMenu(item.key)}
                  className={buttonClass}
                  title={item.label}
                >
                  <Icon className="size-5" />
                </button>

                {isOpen && (
                  <div className="flex flex-col items-center gap-1">
                    {item.children.map((sub) => {
                      const SubIcon = sub.icon;
                      const subActive =
                        sub.href &&
                        (pathname === sub.href ||
                          pathname.startsWith(`${sub.href}/`));

                      return (
                        <Link
                          key={sub.key}
                          href={sub.href || "#"}
                          onClick={() => {
                            onNavigate?.(sub.key);
                          }}
                          title={sub.label}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg transition-colors",
                            subActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          )}
                        >
                          <SubIcon className="size-4" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // ---------- EXPANDED ----------
          return (
            <div key={item.key}>
              <button
                type="button"
                onClick={() => toggleMenu(item.key)}
                className={cn(buttonClass, "justify-between")}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </div>

                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-border pl-3">
                  {item.children.map((sub) => {
                    const SubIcon = sub.icon;
                    const subActive =
                      sub.href &&
                      (pathname === sub.href ||
                        pathname.startsWith(`${sub.href}/`));

                    return (
                      <Link
                        key={sub.key}
                        href={sub.href || "#"}
                        onClick={() => onNavigate?.(sub.key)}
                        className={cn(
                          "flex h-10 items-center gap-2 rounded-lg px-3 text-sm transition-colors",
                          subActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <SubIcon className="size-4" />
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // ====================================
        // MENU ปกติ COLLAPSED
        // ====================================
        if (collapsed) {
          return (
            <Link
              key={item.key}
              href={item.href || "#"}
              onClick={() => onNavigate?.(item.key)}
              title={item.label}
              className={buttonClass}
            >
              <Icon className="size-5" />
            </Link>
          );
        }

        // ====================================
        // MENU ปกติ EXPANDED
        // ====================================
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
  );
}

export function Sidebar({ collapsed, activeKey, onNavigate,role }: SidebarProps) {
 
  
  
  
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-sidebar-border bg-sidebar shadow lg:flex",
        collapsed ? "w-20" : "w-[260px]",
      )}
    >
      <SidebarLogo collapsed={collapsed} />

      <SidebarNav
        role={role}
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
