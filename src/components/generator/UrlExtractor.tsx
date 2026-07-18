'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link2, Sparkles, ArrowRight, CheckCircle, Loader2, AlertCircle, Crown } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import PremiumButton from '@/components/ui/PremiumButton'
import { useAppStore } from '@/lib/store'
import { createDefaultLP } from '@/lib/utils'
import type { ExtractionResult } from '@/types'

const PORTALS = [
  { name: 'Zap Imóveis', color: '#e11d48', logo: '🔴' },
  { name: 'Viva Real', color: '#0ea5e9', logo: '🔵' },
  { name: 'OLX', color: '#f59e0b', logo: '🟡' },
  { name: 'ImóvelWeb', color: '#10b981', logo: '🟢' },
  { name: 'Quinto Andar', color: '#8b5cf6', logo: '🟣' },
  { name: 'Site próprio', color: '#64748b', logo: '⚪' },
]

const STEPS = [
  'Acessando o link...',
  'Lendo informações do imóvel...',
  'Extraindo fotos e preço...',
  'Identificando diferenciais...',
  'A IA está otimizando os textos...',
  'Gerando SEO automaticamente...',
  'Montando sua landing page...',
]

export default function UrlExtractor() {
  const router = useRouter()
  const { user, totalLPsCreated, setCurrentLP, addLandingPage, setCurrentStep } = useAppStore()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentMsg, setCurrentMsg] = useState('')
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!url.trim()) {
      setError('Cole o link do imóvel para continuar.')
      return
    }
    if (!url.startsWith('http')) {
      setError('Link inválido. Certifique-se de incluir https://')
      return
    }

    // Limite do plano gratuito: 1 landing page (mesmo após excluir)
    if (user?.plan !== 'premium' && totalLPsCreated >= 1) {
      setError('Você atingiu o limite do plano gratuito (1 landing page). Faça upgrade para o plano Premium para criar páginas ilimitadas.')
      return
    }

    setError('')
    setLoading(true)
    setProgress(0)

    // Animate progress
    let step = 0
    const interval = setInterval(() => {
      if (step < STEPS.length) {
        setCurrentMsg(STEPS[step])
        setProgress(Math.round((step / STEPS.length) * 90))
        step++
      }
    }, 350)

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const result: ExtractionResult = await res.json()
      clearInterval(interval)

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Falha ao extrair dados')
      }

      setProgress(100)
      setCurrentMsg('Pronto! Abrindo o editor...')

      await new Promise((r) => setTimeout(r, 600))

      const lp = { ...createDefaultLP(result.data), userId: user?.id }
      setCurrentLP(lp)
      addLandingPage(lp)
      setCurrentStep(3)

      // Detecta campos importantes que ficaram vazios após extração
      const d = result.data
      const missing: string[] = []
      if (!d.title || d.title.length < 5)          missing.push('Título do imóvel')
      if (!d.price || d.price === '0')              missing.push('Preço')
      if (!d.city)                                  missing.push('Cidade')
      if (!d.address)                               missing.push('Endereço')
      if (!d.description || d.description.length < 20) missing.push('Descrição')
      if (!d.agentName)                             missing.push('Nome do corretor')
      if (!d.whatsapp)                              missing.push('WhatsApp')

      if (result.partial || missing.length > 0) {
        const missingText = missing.length > 0
          ? `Preencha no editor: ${missing.join(', ')}.`
          : 'Verifique os dados no editor.'
        toast(`⚠️ Extração parcial — ${missingText}`, {
          duration: 10000,
          style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #f59e0b44', maxWidth: '420px' },
        })
      } else {
        toast.success('Dados extraídos com sucesso! Landing page criada.')
      }
      router.push(`/dashboard/editor/${lp.id}`)
    } catch (err: unknown) {
      clearInterval(interval)
      setLoading(false)
      setProgress(0)
      const message = err instanceof Error ? err.message : 'Erro ao processar o link.'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-xl glow-amber">
              <Sparkles className="w-6 h-6 text-dark-950" />
            </div>
            <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Luz Smart Site
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Cole o link do imóvel
          </h2>
          <p className="text-dark-400 text-lg">
            A IA lê todas as informações e gera sua landing page em segundos
          </p>
        </div>

        {/* Limite gratuito atingido */}
        {user?.plan !== 'premium' && totalLPsCreated >= 1 && (
          <div className="glass rounded-2xl p-6 mb-6 border border-brand-400/30 bg-brand-400/5">
            <div className="flex items-start gap-4">
              <Crown className="w-8 h-8 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-1">Limite do plano gratuito atingido</p>
                <p className="text-dark-400 text-sm mb-4">
                  O plano gratuito permite apenas <strong className="text-white">1 landing page</strong>. Faça upgrade para criar páginas ilimitadas.
                </p>
                <PremiumButton />
              </div>
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="glass rounded-2xl p-8 mb-6">
          {!loading ? (
            <>
              <div className="relative mb-4">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="https://www.zapimoveis.com.br/imovel/..."
                  className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-base transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-400/10 px-4 py-3 rounded-xl border border-red-400/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                className="btn-primary w-full justify-center text-base py-4"
              >
                <Sparkles className="w-5 h-5" />
                Gerar Landing Page com IA
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-dark-500 text-sm mt-4">
                Funciona com qualquer portal imobiliário ou site próprio
              </p>
            </>
          ) : (
            <div className="py-4">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-400">{currentMsg}</span>
                  <span className="text-sm font-bold text-brand-400">{progress}%</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {STEPS.slice(0, Math.ceil((progress / 100) * STEPS.length) + 1).map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {i < Math.ceil((progress / 100) * STEPS.length) ? (
                      <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-brand-400 animate-spin flex-shrink-0" />
                    )}
                    <span className={i < Math.ceil((progress / 100) * STEPS.length) ? 'text-dark-300' : 'text-white'}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Portals */}
        <div>
          <p className="text-center text-dark-500 text-sm mb-4">Compatível com os principais portais</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {PORTALS.map((p) => (
              <div
                key={p.name}
                className="glass rounded-xl p-3 text-center cursor-default hover:scale-105 transition-transform"
              >
                <div className="text-2xl mb-1">{p.logo}</div>
                <p className="text-xs text-dark-400 font-medium">{p.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
          {['✅ 3 dias grátis', '🔒 Sem cartão de crédito', '⚡ Página em 60s', '🏆 +2.000 corretores'].map((t) => (
            <span key={t} className="text-dark-400 text-sm">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
