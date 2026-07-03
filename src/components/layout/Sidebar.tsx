'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Globe, Building2, Users, BarChart3,
  Puzzle, Settings, HelpCircle, Plus, Crown, Zap
} from 'lucide-react'
import { cn, daysUntil } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

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

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAppStore()
  const trialDays = user?.trialEndsAt ? daysUntil(user.trialEndsAt) : 0
  const isPremium = user?.plan === 'premium'

  return (
    <aside className="w-[220px] flex-shrink-0 bg-dark-950 border-r border-dark-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-dark-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
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
      </div>

      {/* Create button */}
      <div className="p-4">
        <Link
          href="/dashboard/novo"
          className="btn-primary w-full justify-center text-sm py-3"
        >
          <Plus className="w-4 h-4" />
          Criar novo site
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'nav-item',
              pathname === href || (href !== '/dashboard' && pathname.startsWith(href)) ? 'active' : ''
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Plan badge */}
      <div className="p-4 mt-auto">
        {isPremium ? (
          <div className="card-dark p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Plano Premium</span>
            </div>
            <div className="space-y-1 text-xs text-dark-400">
              <p className="flex items-center gap-1">✓ Páginas ilimitadas</p>
              <p className="flex items-center gap-1">✓ Pixel Meta & Analytics</p>
              <p className="flex items-center gap-1">✓ Exportar leads CSV</p>
              <p className="flex items-center gap-1">✓ Suporte prioritário</p>
            </div>
          </div>
        ) : (
          <div className="card-dark p-3.5 border-brand-500/30">
            <p className="text-xs text-dark-400 mb-1">
              Teste gratuito — <span className="text-brand-400 font-semibold">{trialDays} dias restantes</span>
            </p>
            <a
              href="https://mpago.la/2jcbcsh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center text-xs py-2.5"
            >
              <Crown className="w-3.5 h-3.5" />
              Assinar — R$ 50/mês
            </a>
          </div>
        )}
      </div>
    </aside>
  )
}
