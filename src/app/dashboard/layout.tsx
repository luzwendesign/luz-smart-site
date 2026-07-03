'use client'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isEditor = pathname.startsWith('/dashboard/editor')

  if (isEditor) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
