'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { XCircle, Loader2, ShieldOff, ArrowRight } from 'lucide-react'

// Token de admin — altere para algo secreto seu
const ADMIN_TOKEN = 'luz2026admin'

function CancelarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, setUser } = useAppStore()
  const [status, setStatus] = useState<'loading' | 'done' | 'invalid'>('loading')

  useEffect(() => {
    const token = searchParams.get('token')
    if (token !== ADMIN_TOKEN) {
      setStatus('invalid')
      return
    }
    // Remove premium do usuário atual neste dispositivo
    if (user) {
      setUser({
        ...user,
        plan: 'free',
        trialEndsAt: undefined,
        upgradedAt: undefined,
        paymentId: undefined,
      })
    }
    setStatus('done')
  }, [])

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-brand-400 animate-spin mx-auto mb-4" />
            <p className="text-dark-400">Processando...</p>
          </div>
        )}

        {status === 'done' && (
          <div className="card-dark p-8 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <ShieldOff className="w-10 h-10 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white mb-2">Acesso Premium removido</h1>
              <p className="text-dark-400 text-sm">
                Seu plano foi revertido para o gratuito neste dispositivo.
                O reembolso será processado pelo Mercado Pago em até 5 dias úteis.
              </p>
            </div>
            <button onClick={() => router.push('/dashboard')} className="btn-secondary w-full justify-center py-3">
              Voltar ao dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'invalid' && (
          <div className="card-dark p-8 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-dark-500" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white mb-2">Link inválido</h1>
              <p className="text-dark-400 text-sm">Este link de cancelamento não é válido. Entre em contato com o suporte.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function CancelarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
      </div>
    }>
      <CancelarContent />
    </Suspense>
  )
}
