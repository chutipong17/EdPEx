'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Header } from '@/components/layout/header'
import { Sidebar,SidebarMobileContent } from '@/components/layout/sidebar'

export function IndicatorLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [activeKey, setActiveKey] = useState('manage-indicators')

  // Collapse sidebar automatically on laptop widths (1024px – 1279px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (max-width: 1279px)')
    const apply = () => setCollapsed(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const handleNavigate = (key: string) => {
    setActiveKey(key)
    setMobileOpen(false)
  }

  function toggleSidebar() {
    // On large screens toggle collapse; on small screens open the drawer.
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setCollapsed((c) => !c)
    } else {
      setMobileOpen((o) => !o)
    }
  }


  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} activeKey={activeKey} onNavigate={handleNavigate} />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle className="sr-only">เมนูนำทาง</SheetTitle>
          <SidebarMobileContent activeKey={activeKey} onNavigate={handleNavigate} />
        </SheetContent>
      </Sheet>

      <div
        className={
          collapsed
            ? 'lg:pl-20 transition-[padding] duration-200'
            : 'lg:pl-[260px] transition-[padding] duration-200'
        }
      >
         <Header onToggleSidebar={toggleSidebar} />
        {/* <Header onMenuClick={() => setMobileOpen(true)} /> */}
        <main className="mx-auto w-full max-w-[1800px] p-3 md:p-6">{children}</main>
      </div>
    </div>
  )
}
