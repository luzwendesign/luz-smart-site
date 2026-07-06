'use client'
import { useEffect, useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import { TrendingUp, Eye, Users, MousePointer, BarChart3, RefreshCw, Loader2, BarChart2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { Lead } from '@/app/api/leads/route'

interface DayData {
  day: string
  leads: number
}

export default function EstatisticasPage() {
  const { user } = useAppStore()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  async function fetchLeads(isRefresh = false) {
    if (!user?.id) { setLoading(false); return }
    if (isRefresh) setRefreshing(true)
    try {
      const res = await fetch(`/api/leads?userId=${user.id}`)
      const data = await res.json()
      setLeads(data.leads || [])
      setLastUpdated(new Date())
    } catch {}
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { fetchLeads() }, [user?.id])

  // Métricas calculadas a partir dos leads reais
  const totalLeads = leads.length
  const now = new Date()

  // Visualizações: estimativa baseada em leads (taxa conversão média de 5%)
  // Se não tiver leads, zera tudo
  const estimatedViews = totalLeads > 0 ? Math.round(totalLeads / 0.05) : 0
  const ctaClicks = totalLeads > 0 ? Math.round(totalLeads * 2.8) : 0
  const conversionRate = estimatedViews > 0 ? ((totalLeads / estimatedViews) * 100).toFixed(1) : '0'

  // Leads por dia nos últimos 7 dias
  const last7Days: DayData[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    const dayStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    const count = leads.filter((l) => {
      const ld = new Date(l.createdAt)
      return ld.toDateString() === d.toDateString()
    }).length
    return { day: dayStr, leads: count }
  })

  const maxLeads = Math.max(...last7Days.map((d) => d.leads), 1)
  const hasAnyData = totalLeads > 0

  const kpis = [
    {
      label: 'Visualizações',
      value: hasAnyData ? estimatedViews.toLocaleString('pt-BR') : '0',
      sub: hasAnyData ? 'Estimado pela taxa de conversão' : 'Nenhuma visita ainda',
      icon: Eye,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Leads gerados',
      value: totalLeads.toString(),
      sub: hasAnyData ? `${leads.filter(l => (now.getTime() - new Date(l.createdAt).getTime()) < 7 * 86400000).length} esta semana` : 'Nenhum lead ainda',
      icon: Users,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Taxa de conversão',
      value: `${conversionRate}%`,
      sub: hasAnyData ? 'Leads ÷ Visualizações' : 'Aguardando dados',
      icon: TrendingUp,
      color: 'text-brand-400',
      bg: 'bg-brand-400/10',
    },
    {
      label: 'Cliques no CTA',
      value: hasAnyData ? ctaClicks.toLocaleString('pt-BR') : '0',
      sub: hasAnyData ? 'Estimado pelo volume de leads' : 'Nenhum clique ainda',
      icon: MousePointer,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar
        title="Estatísticas"
        subtitle={lastUpdated ? `Atualizado às ${lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Carregando...'}
        actions={
          <button
            onClick={() => fetchLeads(true)}
            disabled={refreshing || loading}
            className="btn-secondary text-sm py-2.5 px-4 disabled:opacity-50"
          >
            {refreshing
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <RefreshCw className="w-4 h-4" />
            }
            Atualizar
          </button>
        }
      />

      <div className="p-4 md:p-6 space-y-6">

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map(({ label, value, sub, icon: Icon, color, bg }) => (
                <div key={label} className="card-dark">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-dark-400 text-xs">{label}</p>
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{value}</p>
                  <p className="text-dark-500 text-xs">{sub}</p>
                </div>
              ))}
            </div>

            {/* Gráfico de leads por dia */}
            <div className="card-dark">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-400" />
                  Leads nos últimos 7 dias
                </h3>
                <span className="text-xs text-dark-400">Dados reais</span>
              </div>

              {!hasAnyData ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                    <BarChart2 className="w-8 h-8 text-dark-600" />
                  </div>
                  <p className="text-white font-semibold mb-1">Nenhum dado ainda</p>
                  <p className="text-dark-400 text-sm max-w-xs">
                    O gráfico será atualizado automaticamente quando sua landing page receber leads.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-2 h-40 border-b border-dark-800 pb-2">
                    {last7Days.map(({ day, leads: count }) => (
                      <div key={day} className="flex-1 flex flex-col items-center justify-end gap-1">
                        {count > 0 && (
                          <span className="text-xs font-bold text-brand-400">{count}</span>
                        )}
                        <div
                          className={`w-full rounded-t-lg transition-all ${count > 0 ? 'bg-gradient-to-t from-brand-500 to-brand-400' : 'bg-dark-800'}`}
                          style={{ height: count > 0 ? `${Math.max((count / maxLeads) * 100, 8)}%` : '4px' }}
                          title={`${count} lead${count !== 1 ? 's' : ''}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {last7Days.map(({ day }) => (
                      <div key={day} className="flex-1 text-center text-xs text-dark-500">{day}</div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Aviso metodologia */}
            <div className="bg-dark-800/60 border border-dark-700 rounded-xl p-4">
              <p className="text-xs font-semibold text-dark-300 mb-1">Como as métricas são calculadas</p>
              <p className="text-xs text-dark-500 leading-relaxed">
                <strong className="text-dark-400">Leads gerados</strong> são contados diretamente dos formulários preenchidos.
                <strong className="text-dark-400"> Visualizações</strong> e <strong className="text-dark-400">Cliques no CTA</strong> são estimativas baseadas na taxa de conversão média do setor imobiliário (5%).
                Para dados precisos de tráfego, integre o Google Analytics ou Facebook Pixel em <strong className="text-dark-400">Integrações</strong>.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
