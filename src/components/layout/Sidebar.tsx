'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Globe, Building2, Users, BarChart3,
  Puzzle, Settings, HelpCircle, Plus, Crown, Zap, LogOut, X
} from 'lucide-react'
import { cn, daysUntil } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import PremiumButton from '@/components/ui/PremiumButton'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/sites', icon: Globe, label: 'Meus Sites' },
  { href: '/dashboard/modelos', icon: Building2, label: 'Modelos' },
  { href: '/dashboard/imoveis', icon: Building2, label: 'Imóveis' },
  { href: '/dashboard/leads', icon: Users, label: 'Leads' },
  { href: '/dashboard/estatisticas', icon: BarChart3, label: 'Estatísticas' },
  { href: '/dashboard/integracoes', icon: Puzzle, label: 'Integrações' },
  { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
  { href: '/dashboard/suporte', icon: HelpCircle, label: 'Suporte' },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser } = useAppStore()
  const trialDays = user?.trialEndsAt ? daysUntil(user.trialEndsAt) : 0
  const isPremium = user?.plan === 'premium'

  function handleLogout() {
    setUser(null)
    router.push('/login')
  }

  function handleNavClick() {
    onClose?.()
  }

  return (
    <aside className="w-[240px] flex-shrink-0 bg-dark-950 border-r border-dark-800 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-dark-800 flex items-center justify-between">
        <Link href="/dashboard" onClick={handleNavClick} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-dark-950" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Luz Smart
            </p>
            <p className="text-brand-400 text-xs font-semibold">Site</p>
          </div>
        </Link>
        {/* Botão fechar no mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-dark-500 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Create button */}
      <div className="p-3">
        <Link
          href="/dashboard/novo"
          onClick={handleNavClick}
          className="btn-primary w-full justify-center text-sm py-3"
        >
          <Plus className="w-4 h-4" />
          Criar novo site
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={handleNavClick}
            className={cn(
              'nav-item',
              pathname === href || (href !== '/dashboard' && pathname.startsWith(href)) ? 'active' : ''
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-3 border-t border-dark-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-dark-950 font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0) ?? 'C'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-dark-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-dark-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plan badge */}
      <div className="p-3">
        {isPremium ? (
          <div className="card-dark p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Plano Premium</span>
            </div>
            <div className="space-y-0.5 text-xs text-dark-400">
              <p>✓ Páginas ilimitadas</p>
              <p>✓ Pixel Meta & Analytics</p>
              <p>✓ Exportar leads CSV</p>
              <p>✓ Suporte prioritário</p>
            </div>
          </div>
        ) : (
          <div className="card-dark p-3 border-brand-500/30">
            <p className="text-xs text-dark-400 mb-2">
              Teste gratuito — <span className="text-brand-400 font-semibold">{trialDays} dias restantes</span>
            </p>
            <PremiumButton className="btn-primary w-full justify-center" size="sm" label="Assinar — R$ 50/mês" />
          </div>
        )}
      </div>
    </aside>
  )
}
