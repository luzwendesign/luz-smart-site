'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import AuthGuard from '@/components/layout/AuthGuard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isEditor = pathname.startsWith('/dashboard/editor')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isEditor) {
    return <AuthGuard>{children}</AuthGuard>
  }

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-dark-950">
        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 md:relative md:z-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {/* Mobile topbar */}
          <div className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-dark-800 bg-dark-950 sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect y="3" width="20" height="2" rx="1"/>
                <rect y="9" width="20" height="2" rx="1"/>
                <rect y="15" width="20" height="2" rx="1"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <span className="font-bold text-white text-sm">Luz Smart Site</span>
            </div>
          </div>

          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
