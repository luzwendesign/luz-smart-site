'use client'
import TopBar from '@/components/layout/TopBar'
import { TrendingUp, Eye, Users, MousePointer, BarChart3 } from 'lucide-react'

const CHART_DATA = [
  { day: '01/05', views: 280, leads: 12 },
  { day: '08/05', views: 420, leads: 18 },
  { day: '15/05', views: 680, leads: 31 },
  { day: '22/05', views: 920, leads: 42 },
  { day: '29/05', views: 1250, leads: 58 },
]

const maxViews = Math.max(...CHART_DATA.map((d) => d.views))

export default function EstatisticasPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar title="Estatísticas" subtitle="Últimos 30 dias" />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Visualizações', value: '1.250', change: '+28%', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Leads gerados', value: '86', change: '+35%', icon: Users, color: 'text-green-400', bg: 'bg-green-400/10' },
            { label: 'Taxa conversão', value: '6,8%', change: '+12%', icon: TrendingUp, color: 'text-brand-400', bg: 'bg-brand-400/10' },
            { label: 'Cliques CTA', value: '412', change: '+19%', icon: MousePointer, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          ].map(({ label, value, change, icon: Icon, color, bg }) => (
            <div key={label} className="card-dark">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dark-400 text-xs">{label}</p>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1">{value}</p>
              <p className="text-green-400 text-xs font-semibold">{change} vs período anterior</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card-dark">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-400" />
              Desempenho do site
            </h3>
            <span className="text-xs text-dark-400">Últimos 30 dias</span>
          </div>
          <div className="relative">
            {/* Y-axis labels */}
            <div className="flex gap-4">
              <div className="w-16 flex-shrink-0 flex flex-col justify-between text-right pb-8 h-48">
                {[maxViews, Math.round(maxViews * 0.75), Math.round(maxViews * 0.5), Math.round(maxViews * 0.25), 0].map((v) => (
                  <span key={v} className="text-xs text-dark-600">{v.toLocaleString()}</span>
                ))}
              </div>

              {/* Bars */}
              <div className="flex-1 flex items-end gap-3 pb-8 h-48 border-l border-b border-dark-800">
                {CHART_DATA.map(({ day, views, leads }) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1 items-end" style={{ height: '160px' }}>
                      <div
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-400 opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${(views / maxViews) * 100}%` }}
                        title={`${views} views`}
                      />
                      <div
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${(leads / (maxViews / 10)) * 10}%` }}
                        title={`${leads} leads`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex gap-3 pl-20 mt-2">
              {CHART_DATA.map(({ day }) => (
                <div key={day} className="flex-1 text-center text-xs text-dark-500">{day}</div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2 text-xs text-dark-400">
              <div className="w-3 h-3 rounded bg-brand-400" />
              Visualizações
            </div>
            <div className="flex items-center gap-2 text-xs text-dark-400">
              <div className="w-3 h-3 rounded bg-blue-400" />
              Leads
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
