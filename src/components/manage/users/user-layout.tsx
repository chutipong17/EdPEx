'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Header } from '@/components/layout/header'
import { Sidebar, SidebarMobileContent } from '@/components/layout/sidebar'

export function UserLayout({ children }: { children: React.ReactNode }) {
 




  return (
    <main className="mx-auto w-full max-w-[1800px] p-3 md:p-6">{children}</main>
  )
}
