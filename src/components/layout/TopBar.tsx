'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, ChevronDown, User, Settings, CreditCard, LogOut, CheckCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface TopBarProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

const NOTIFICATIONS = [
  { id: 1, text: 'Novo lead: Ana Silva — Apartamento no Centro', time: '2 min', read: false },
  { id: 2, text: 'Novo lead: Roberto Alves — Apto no Centro', time: '1h', read: false },
  { id: 3, text: 'Landing page publicada com sucesso!', time: '3h', read: true },
  { id: 4, text: 'Seu trial expira em 3 dias. Faça upgrade!', time: '1d', read: true },
]

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { user, setUser } = useAppStore()
  const router = useRouter()
  const [showNotif, setShowNotif] = useState(false)

  function handleLogout() {
    setUser(null)
    router.push('/login')
  }
  const [showProfile, setShowProfile] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function markAllRead() {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })))
  }

  return (
    <header className="h-16 border-b border-dark-800 flex items-center justify-between px-6 bg-dark-950 sticky top-0 z-30">
      <div>
        {title && (
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {title}
          </h1>
        )}
        {subtitle && <p className="text-xs text-dark-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        {/* Notificações */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false) }}
            className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors text-dark-400 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-400 rounded-full text-dark-950 text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800">
                <span className="font-semibold text-white text-sm">Notificações</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-400 hover:text-brand-300">
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-dark-800 cursor-pointer hover:bg-dark-800 transition-colors ${!n.read ? 'bg-brand-400/5' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-dark-600' : 'bg-brand-400'}`} />
                    <div>
                      <p className={`text-sm leading-snug ${n.read ? 'text-dark-400' : 'text-white'}`}>{n.text}</p>
                      <p className="text-xs text-dark-600 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              {notifications.every((n) => n.read) && (
                <div className="px-4 py-6 text-center">
                  <CheckCircle className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                  <p className="text-dark-500 text-sm">Tudo em dia!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Perfil */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false) }}
            className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-dark-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-dark-950 font-bold text-sm">
              {user?.name?.charAt(0) ?? 'C'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{user?.name ?? 'Corretor'}</p>
              <p className="text-xs text-dark-400 leading-tight">Conta Premium</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-dark-800">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-dark-400">{user?.email}</p>
                {user?.creci && <p className="text-xs text-dark-500 mt-0.5">{user.creci}</p>}
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <Link href="/dashboard/configuracoes" onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-colors">
                  <User className="w-4 h-4" /> Meu perfil
                </Link>
                <Link href="/dashboard/configuracoes" onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-colors">
                  <Settings className="w-4 h-4" /> Configurações
                </Link>
                <a href="https://mpago.la/2jcbcsh" target="_blank" rel="noopener noreferrer" onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-colors">
                  <CreditCard className="w-4 h-4" /> Plano & Pagamento
                </a>
              </div>

              <div className="border-t border-dark-800 py-1.5">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-800 transition-colors">
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
