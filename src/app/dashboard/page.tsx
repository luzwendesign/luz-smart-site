'use client'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { getEffectivePlan } from '@/lib/blocklist'
import TopBar from '@/components/layout/TopBar'
import {
  Plus, Globe, Eye, Users, TrendingUp, ArrowRight,
  BarChart3, ExternalLink, CheckCircle, Crown, Zap, Copy, Share2
} from 'lucide-react'
import { useState } from 'react'
import PremiumButton from '@/components/ui/PremiumButton'
import { formatCurrency, daysUntil } from '@/lib/utils'

const STATS = [
  { label: 'Visualizações', value: '0', change: '—', icon: Eye, color: 'text-blue-400' },
  { label: 'Leads', value: '0', change: '—', icon: Users, color: 'text-green-400' },
  { label: 'Taxa de conversão', value: '0%', change: '—', icon: TrendingUp, color: 'text-brand-400' },
]

const QUICK_ACTIONS = [
  { label: 'Criar nova landing page', href: '/dashboard/novo', icon: Plus, primary: true },
  { label: 'Ver meus sites', href: '/dashboard/sites', icon: Globe, primary: false },
  { label: 'Gerenciar leads', href: '/dashboard/leads', icon: Users, primary: false },
  { label: 'Estatísticas', href: '/dashboard/estatisticas', icon: BarChart3, primary: false },
]

function CopyLink({ lp, isPremium }: { lp: any; isPremium: boolean }) {
  const [copied, setCopied] = useState(false)
  const slug = lp.customSlug || lp.id
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://luz-smart-site.vercel.app'
  const url = `${baseUrl}/p/${slug}`

  function copy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2 flex items-center gap-1.5 bg-dark-800 rounded-lg px-2.5 py-1.5">
      <Globe className="w-3 h-3 text-dark-500 flex-shrink-0" />
      <span className="text-xs text-dark-400 truncate flex-1 font-mono">/p/{slug.length > 16 ? slug.slice(0, 16) + '…' : slug}</span>
      <button onClick={copy} className="text-dark-500 hover:text-brand-400 transition-colors flex-shrink-0" title="Copiar link">
        {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-dark-500 hover:text-brand-400 transition-colors flex-shrink-0" title="Abrir site">
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  )
}

export default function DashboardPage() {
  const { user, landingPages } = useAppStore()
  const trialDays = user?.trialEndsAt ? daysUntil(user.trialEndsAt) : 0

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar title="Dashboard" subtitle={`Bem-vindo, ${user?.name || 'Corretor'}!`} />

      <div className="p-6 space-y-6">
        {/* Trial banner */}
        {user?.plan !== 'premium' && trialDays > 0 && (
          <div className="rounded-2xl p-5 border border-brand-500/30 bg-gradient-to-r from-brand-500/10 to-brand-400/5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-brand-400" />
              <div>
                <p className="font-bold text-white">Teste gratuito ativo — {trialDays} dias restantes</p>
                <p className="text-dark-400 text-sm">Faça upgrade para continuar após o período de teste.</p>
              </div>
            </div>
            <PremiumButton label="Assinar por R$ 50/mês" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="card-dark">
              <div className="flex items-center justify-between mb-4">
                <p className="text-dark-400 text-sm font-medium">{label}</p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-dark-700`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1">{value}</p>
              <p className="text-dark-500 text-sm font-semibold">{change} vs mês anterior</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>Ações rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon, primary }) => (
              <Link
                key={href}
                href={href}
                className={primary
                  ? 'btn-primary justify-center py-4 flex-col gap-2 text-sm'
                  : 'card-dark flex flex-col items-center gap-2 py-4 text-center hover:border-dark-600 cursor-pointer text-sm text-dark-300 hover:text-white'
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent LPs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Minhas landing pages
            </h2>
            <Link href="/dashboard/sites" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {landingPages.length === 0 ? (
            <div className="card-dark text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-dark-600" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Nenhuma landing page ainda</h3>
              <p className="text-dark-400 mb-6">Cole o link de um imóvel e gere sua primeira página em segundos.</p>
              <Link href="/dashboard/novo" className="btn-primary inline-flex">
                <Plus className="w-4 h-4" /> Criar minha primeira página
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {landingPages.map((lp) => (
                <div key={lp.id} className="card-dark overflow-hidden p-0">
                  {/* Preview thumbnail */}
                  <div className="relative h-40 bg-dark-800 overflow-hidden">
                    {lp.propertyData.images[0] ? (
                      <img src={lp.propertyData.images[0]} alt="" className="w-full h-full object-cover opacity-70" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="w-12 h-12 text-dark-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                    {lp.published && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" /> Publicado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm mb-1 truncate">{lp.propertyData.title}</h3>
                    <p className="text-dark-400 text-xs mb-2">{lp.propertyData.city} · {lp.propertyData.priceFormatted}</p>
                    <CopyLink lp={lp} isPremium={getEffectivePlan(user?.email, user?.plan ?? 'free') === 'premium'} />
                    <div className="flex gap-2 mt-2">
                      <Link
                        href={`/dashboard/editor/${lp.id}`}
                        className="flex-1 text-center py-2 text-xs font-semibold bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                      >
                        Editar
                      </Link>
                      <a
                        href={`/preview/${lp.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-brand-400/10 text-brand-400 rounded-lg hover:bg-brand-400/20 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Ver
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new */}
              <Link
                href="/dashboard/novo"
                className="card-dark flex flex-col items-center justify-center gap-3 py-16 text-center hover:border-brand-500/50 hover:bg-brand-400/5 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-dark-800 group-hover:bg-brand-400/10 flex items-center justify-center transition-colors">
                  <Plus className="w-7 h-7 text-dark-600 group-hover:text-brand-400 transition-colors" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm group-hover:text-brand-400 transition-colors">Nova landing page</p>
                  <p className="text-dark-500 text-xs mt-0.5">Cole o link de um imóvel</p>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom marketing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-dark text-center py-6">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-sm font-semibold text-white mb-1">Modelos prontos</p>
            <p className="text-xs text-dark-400">Escolha o modelo ideal para seu imóvel</p>
          </div>
          <div className="card-dark text-center py-6">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm font-semibold text-white mb-1">Preview responsivo</p>
            <p className="text-xs text-dark-400">Veja como fica em diferentes dispositivos</p>
          </div>
          <div className="card-dark text-center py-6">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-semibold text-white mb-1">Publicação rápida</p>
            <p className="text-xs text-dark-400">Seu site pronto em minutos</p>
          </div>
        </div>
      </div>
    </div>
  )
}
