'use client'
import Link from 'next/link'
import { Crown, CheckCircle, Zap, ArrowLeft } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { getEffectivePlan } from '@/lib/blocklist'
import { daysUntil } from '@/lib/utils'

const PAYMENT_LINK = 'https://mpago.la/2jcbcsh'

const FREE_FEATURES = [
  '1 landing page',
  'Preview do site',
  'Editor visual completo',
  '3 dias de teste grátis',
]

const PREMIUM_FEATURES = [
  'Páginas ilimitadas',
  'Pixel Meta & Facebook',
  'Google Analytics (GA4)',
  'Google Tag Manager',
  'Exportar leads CSV',
  'SEO avançado automático',
  'Scripts personalizados',
  'Suporte prioritário',
  'Redes sociais no rodapé',
  'Seção de itens disponíveis',
  'Caixa de preço + WhatsApp',
  'Todos os temas e fontes',
]

export default function PlanosPage() {
  const { user } = useAppStore()
  const isPremium = getEffectivePlan(user?.email, user?.plan ?? 'free') === 'premium'
  const trialDays = user?.trialEndsAt ? daysUntil(user.trialEndsAt) : 0

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-4 py-16">
      {/* Back */}
      <Link href="/dashboard" className="flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-10 self-start max-w-4xl w-full mx-auto transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar ao dashboard
      </Link>

      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-400/10 border border-brand-400/20 text-brand-400 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" /> Planos Luz Smart Site
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Escolha seu plano
          </h1>
          <p className="text-dark-400 text-lg">
            Crie landing pages profissionais para seus imóveis em minutos
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="card-dark p-7 relative">
            <div className="mb-5">
              <p className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-1">Grátis</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white">R$ 0</span>
                <span className="text-dark-400 text-sm mb-1.5">/mês</span>
              </div>
              <p className="text-dark-500 text-xs mt-1">3 dias de teste completo</p>
            </div>

            {trialDays > 0 && !isPremium && (
              <div className="bg-brand-400/10 border border-brand-400/20 rounded-xl px-3 py-2 mb-5 text-xs text-brand-400 font-semibold">
                ⏱ {trialDays} dias restantes no seu teste
              </div>
            )}

            <ul className="space-y-2.5 mb-7">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-dark-300">
                  <CheckCircle className="w-4 h-4 text-dark-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="py-3 text-center rounded-xl border border-dark-700 text-dark-500 text-sm font-semibold">
              {isPremium ? 'Plano anterior' : 'Plano atual'}
            </div>
          </div>

          {/* Premium */}
          <div className="relative rounded-2xl p-7 border-2 border-brand-400 bg-gradient-to-br from-brand-400/10 via-dark-900 to-dark-950 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="absolute top-4 right-4">
              <span className="bg-brand-400 text-dark-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                Mais popular
              </span>
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-brand-400" />
                <p className="text-sm font-semibold text-brand-400 uppercase tracking-wider">Premium</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-white">R$ 50</span>
                <span className="text-dark-400 text-sm mb-1.5">/mês</span>
              </div>
              <p className="text-dark-500 text-xs mt-1">Cancele quando quiser</p>
            </div>

            <ul className="space-y-2.5 mb-7">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-dark-200">
                  <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <div className="w-full py-3.5 text-center rounded-xl bg-brand-400/20 border border-brand-400/40 text-brand-400 font-bold text-sm">
                ✓ Plano ativo
              </div>
            ) : (
              <a
                href={PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center py-3.5 text-sm font-bold"
              >
                <Crown className="w-4 h-4" />
                Assinar agora — R$ 50/mês
              </a>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-xl mx-auto space-y-4">
          <h2 className="text-lg font-bold text-white text-center mb-6">Dúvidas frequentes</h2>
          {[
            {
              q: 'Como funciona o teste gratuito?',
              a: 'Você tem 3 dias de acesso completo. Pode criar 1 landing page e testar todas as funcionalidades do editor.',
            },
            {
              q: 'Como faço para assinar?',
              a: 'Clique em "Assinar agora" e você será redirecionado para o pagamento seguro via Mercado Pago. Aceita cartão, Pix e boleto.',
            },
            {
              q: 'Posso cancelar quando quiser?',
              a: 'Sim. Não há fidelidade. Cancele a qualquer momento diretamente no Mercado Pago.',
            },
            {
              q: 'Meus sites ficam no ar após cancelar?',
              a: 'Após o cancelamento, seus sites permanecem ativos até o fim do período pago.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="card-dark p-5">
              <p className="font-semibold text-white text-sm mb-2">{q}</p>
              <p className="text-dark-400 text-sm">{a}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-dark-600 text-xs mt-10">
          Pagamento seguro via Mercado Pago · Suporte: atendimentofdconsultoria@gmail.com
        </p>
      </div>
    </div>
  )
}
