'use client'
import { useEffect, useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import { useAppStore } from '@/lib/store'
import { Users, Phone, Mail, Download, Inbox, Loader2 } from 'lucide-react'
import type { Lead } from '@/app/api/leads/route'

export default function LeadsPage() {
  const { user } = useAppStore()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    fetch(`/api/leads?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setLeads(data.leads || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.id])

  function formatDate(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return 'Agora mesmo'
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
    return `${Math.floor(diff / 86400)} dias atrás`
  }

  function exportCSV() {
    const header = 'Nome,WhatsApp,E-mail,Imóvel,Data\n'
    const rows = leads.map((l) =>
      `"${l.name}","${l.whatsapp}","${l.email}","${l.landingPageTitle}","${new Date(l.createdAt).toLocaleString('pt-BR')}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar
        title="Leads"
        subtitle={leads.length > 0 ? `${leads.length} lead${leads.length !== 1 ? 's' : ''} recebido${leads.length !== 1 ? 's' : ''}` : 'Nenhum lead ainda'}
        actions={
          leads.length > 0 ? (
            <button onClick={exportCSV} className="btn-secondary text-sm py-2.5 px-4">
              <Download className="w-4 h-4" /> Exportar CSV
            </button>
          ) : undefined
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total de leads', value: leads.length },
            { label: 'Hoje', value: leads.filter((l) => new Date(l.createdAt).toDateString() === new Date().toDateString()).length },
            { label: 'Esta semana', value: leads.filter((l) => (Date.now() - new Date(l.createdAt).getTime()) < 7 * 86400000).length },
            { label: 'Último lead', value: leads.length > 0 ? formatDate(leads[0].createdAt) : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="card-dark">
              <p className="text-dark-400 text-xs mb-1">{label}</p>
              <p className="text-xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && leads.length === 0 && (
          <div className="card-dark text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-dark-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Nenhum lead ainda</h3>
            <p className="text-dark-400 text-sm max-w-sm mx-auto">
              Quando um visitante preencher o formulário na sua landing page, os dados aparecerão aqui.
            </p>
          </div>
        )}

        {/* Leads table */}
        {!loading && leads.length > 0 && (
          <div className="card-dark p-0 overflow-hidden">
            <div className="p-4 border-b border-dark-800">
              <h3 className="font-semibold text-white">Leads recebidos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-800">
                    <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Nome</th>
                    <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Contato</th>
                    <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Imóvel</th>
                    <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Quando</th>
                    <th className="text-right p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-dark-800 hover:bg-dark-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-400/10 flex items-center justify-center text-brand-400 font-bold text-sm flex-shrink-0">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium text-sm">{lead.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="text-dark-300 text-xs">{lead.whatsapp}</p>
                          {lead.email && <p className="text-dark-500 text-xs">{lead.email}</p>}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-dark-300 text-sm truncate max-w-[180px]">{lead.landingPageTitle}</p>
                        {lead.landingPageSlug && (
                          <p className="text-dark-600 text-xs">/p/{lead.landingPageSlug}</p>
                        )}
                      </td>
                      <td className="p-4 text-dark-500 text-xs whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Abrir WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="p-1.5 rounded-lg bg-dark-700 text-dark-400 hover:text-white transition-colors"
                              title="Enviar e-mail"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Aviso sobre persistência */}
        <div className="bg-brand-400/5 border border-brand-400/20 rounded-xl p-4">
          <p className="text-xs font-semibold text-brand-400 mb-1">💡 Como funcionam os leads</p>
          <p className="text-xs text-dark-400">
            Os leads são recebidos quando visitantes preenchem o formulário nas suas landing pages.
            Para receber por e-mail também, configure a integração de notificações nas Configurações.
          </p>
        </div>
      </div>
    </div>
  )
}
