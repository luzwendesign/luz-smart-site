'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { CheckCircle, XCircle, Loader2, Crown, ArrowRight, Sparkles } from 'lucide-react'

type Status = 'loading' | 'success' | 'pending' | 'error'

export default function AtivacaoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, setUser } = useAppStore()
  const [status, setStatus] = useState<Status>('loading')
  const [paymentId, setPaymentId] = useState<string>('')

  useEffect(() => {
    // Parâmetros que o Mercado Pago envia na URL de retorno
    const collectionStatus = searchParams.get('collection_status')
    const mpStatus         = searchParams.get('status')
    const pmtId            = searchParams.get('payment_id') || searchParams.get('collection_id') || ''

    setPaymentId(pmtId)

    const approved =
      collectionStatus === 'approved' ||
      mpStatus === 'approved'

    const pending =
      collectionStatus === 'in_process' ||
      collectionStatus === 'pending' ||
      mpStatus === 'in_process' ||
      mpStatus === 'pending'

    if (approved) {
      // Ativa Premium no store — persiste no localStorage
      const now = new Date().toISOString()
      const premiumUser = {
        ...(user || { id: `user_${Date.now()}`, name: 'Corretor', email: '', createdAt: now }),
        plan: 'premium' as const,
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        upgradedAt: now,
        paymentId: pmtId,
      }
      setUser(premiumUser)
      setStatus('success')
    } else if (pending) {
      setStatus('pending')
    } else {
      setStatus('error')
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-brand-400 animate-spin mx-auto mb-4" />
            <p className="text-dark-400">Verificando pagamento...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="card-dark p-8 text-center space-y-6">
            {/* Ícone animado */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-brand-400/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-xl">
                <Crown className="w-12 h-12 text-dark-950" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-white mb-2">
                Bem-vindo ao Premium! 🎉
              </h1>
              <p className="text-dark-400 text-sm">
                Seu pagamento foi confirmado. O plano Premium já está ativo na sua conta.
              </p>
            </div>

            {paymentId && (
              <div className="bg-dark-800 rounded-xl px-4 py-3 text-left">
                <p className="text-xs text-dark-500 mb-1">ID do pagamento</p>
                <p className="text-xs text-dark-300 font-mono">{paymentId}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                { icon: '∞', label: 'Sites ilimitados' },
                { icon: '🌐', label: 'Domínio personalizado' },
                { icon: '🎨', label: 'Todos os designs' },
                { icon: '📊', label: 'Estatísticas completas' },
                { icon: '📤', label: 'Exportar leads CSV' },
                { icon: '⚡', label: 'Suporte prioritário' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm text-dark-300">
                  <span className="text-brand-400 font-bold">{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              <Sparkles className="w-5 h-5" />
              Acessar meu dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === 'pending' && (
          <div className="card-dark p-8 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
              <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white mb-2">Pagamento em análise</h1>
              <p className="text-dark-400 text-sm">
                Seu pagamento está sendo processado. Isso pode levar alguns minutos.
                Assim que aprovado, seu acesso Premium será liberado automaticamente.
              </p>
            </div>
            {paymentId && (
              <div className="bg-dark-800 rounded-xl px-4 py-3 text-left">
                <p className="text-xs text-dark-500 mb-1">ID do pagamento</p>
                <p className="text-xs text-dark-300 font-mono">{paymentId}</p>
              </div>
            )}
            <p className="text-dark-600 text-xs">
              Guarde seu ID de pagamento. Se o problema persistir, entre em contato pelo WhatsApp.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-secondary w-full justify-center py-3"
            >
              Voltar ao dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="card-dark p-8 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white mb-2">Pagamento não confirmado</h1>
              <p className="text-dark-400 text-sm">
                Não conseguimos confirmar seu pagamento. Se você já pagou, entre em contato
                pelo WhatsApp com o comprovante.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://mpago.la/2jcbcsh"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center py-3"
              >
                <Crown className="w-4 h-4" /> Tentar novamente
              </a>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-secondary w-full justify-center py-3"
              >
                Voltar ao dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
