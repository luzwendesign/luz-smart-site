'use client'
import TopBar from '@/components/layout/TopBar'
import { Users, Phone, Mail, MessageSquare, Download, Filter } from 'lucide-react'

const MOCK_LEADS = [
  { id: '1', name: 'Ana Carolina Silva', email: 'ana@email.com', whatsapp: '(11) 98888-1111', property: 'Apartamento no Centro', time: '2 horas atrás', source: 'Formulário' },
  { id: '2', name: 'Roberto Alves', email: 'roberto@email.com', whatsapp: '(11) 97777-2222', property: 'Apartamento no Centro', time: '5 horas atrás', source: 'WhatsApp' },
  { id: '3', name: 'Fernanda Oliveira', email: 'fernanda@email.com', whatsapp: '(21) 96666-3333', property: 'Apartamento no Centro', time: '1 dia atrás', source: 'Formulário' },
  { id: '4', name: 'Carlos Eduardo', email: 'carlos@email.com', whatsapp: '(31) 95555-4444', property: 'Apartamento no Centro', time: '2 dias atrás', source: 'Formulário' },
]

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar
        title="Leads"
        subtitle={`${MOCK_LEADS.length} leads recebidos`}
        actions={
          <button className="btn-secondary text-sm py-2.5 px-4">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        }
      />
      <div className="p-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: '86', icon: Users },
            { label: 'Esta semana', value: '14', icon: Users },
            { label: 'Taxa resp.', value: '72%', icon: MessageSquare },
            { label: 'Conversões', value: '8', icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-dark">
              <p className="text-dark-400 text-xs mb-1">{label}</p>
              <p className="text-2xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Leads table */}
        <div className="card-dark p-0 overflow-hidden">
          <div className="p-4 border-b border-dark-800 flex items-center justify-between">
            <h3 className="font-semibold text-white">Leads recentes</h3>
            <button className="btn-secondary text-xs py-1.5 px-3">
              <Filter className="w-3.5 h-3.5" /> Filtrar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800">
                  <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Nome</th>
                  <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Contato</th>
                  <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Imóvel</th>
                  <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Origem</th>
                  <th className="text-left p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Quando</th>
                  <th className="text-right p-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADS.map((lead) => (
                  <tr key={lead.id} className="border-b border-dark-800 hover:bg-dark-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-400/10 flex items-center justify-center text-brand-400 font-bold text-sm">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium text-sm">{lead.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="text-dark-300 text-xs">{lead.email}</p>
                        <p className="text-dark-300 text-xs">{lead.whatsapp}</p>
                      </div>
                    </td>
                    <td className="p-4 text-dark-300 text-sm">{lead.property}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-400/10 text-brand-400">
                        {lead.source}
                      </span>
                    </td>
                    <td className="p-4 text-dark-500 text-xs">{lead.time}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${lead.whatsapp.replace(/\D/g,'')}`}
                          className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-1.5 rounded-lg bg-dark-700 text-dark-400 hover:text-white transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
