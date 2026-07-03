'use client'
import TopBar from '@/components/layout/TopBar'
import { CheckCircle, ExternalLink } from 'lucide-react'

const INTEGRATIONS = [
  {
    name: 'Meta Pixel (Facebook)',
    desc: 'Rastreie conversões e crie públicos personalizados no Facebook e Instagram.',
    icon: '📊',
    connected: false,
    premium: false,
    fieldLabel: 'Pixel ID',
    placeholder: '123456789012345',
  },
  {
    name: 'Google Analytics 4',
    desc: 'Análise avançada de tráfego e comportamento dos visitantes.',
    icon: '📈',
    connected: false,
    premium: false,
    fieldLabel: 'Measurement ID',
    placeholder: 'G-XXXXXXXXXX',
  },
  {
    name: 'Google Tag Manager',
    desc: 'Gerencie todos os seus scripts de rastreamento em um só lugar.',
    icon: '🏷️',
    connected: false,
    premium: false,
    fieldLabel: 'Container ID',
    placeholder: 'GTM-XXXXXXX',
  },
  {
    name: 'RD Station CRM',
    desc: 'Envie leads automaticamente para o seu CRM favorito.',
    icon: '💼',
    connected: false,
    premium: true,
    fieldLabel: 'API Key',
    placeholder: 'sua-api-key',
  },
  {
    name: 'Pipedrive',
    desc: 'Integre leads direto no pipeline de vendas do Pipedrive.',
    icon: '🔀',
    connected: false,
    premium: true,
    fieldLabel: 'API Token',
    placeholder: 'seu-token',
  },
  {
    name: 'Zapier Webhook',
    desc: 'Conecte com mais de 5.000 ferramentas via webhook.',
    icon: '⚡',
    connected: false,
    premium: true,
    fieldLabel: 'Webhook URL',
    placeholder: 'https://hooks.zapier.com/...',
  },
]

export default function IntegracoesPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar title="Integrações" subtitle="Conecte com suas ferramentas favoritas" />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEGRATIONS.map((int) => (
            <div key={int.name} className="card-dark">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {int.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm">{int.name}</h3>
                    {int.premium && <span className="badge-premium text-xs">Premium</span>}
                    {int.connected && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" /> Conectado
                      </span>
                    )}
                  </div>
                  <p className="text-dark-400 text-xs mb-3">{int.desc}</p>
                  {!int.premium ? (
                    <div className="flex gap-2">
                      <input
                        className="input-dark flex-1 py-2 text-sm"
                        placeholder={int.placeholder}
                      />
                      <button className="btn-primary text-xs py-2 px-4">Salvar</button>
                    </div>
                  ) : (
                    <button className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Upgrade para conectar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
