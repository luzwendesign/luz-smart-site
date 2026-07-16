'use client'
import { useState } from 'react'
import { Crown, X, Copy, CheckCircle, ExternalLink, Zap } from 'lucide-react'

const MP_LINK = 'https://mpago.la/2jcbcsh'
const ACTIVATION_URL = 'https://luz-smart-site.vercel.app/ativacao?collection_status=approved'

interface PremiumButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export default function PremiumButton({ className = 'btn-primary', size = 'md', label }: PremiumButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const sizeClasses = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2.5 px-5',
    lg: 'text-base py-3 px-6',
  }

  function handleClick() {
    window.open(MP_LINK, '_blank')
    setShowModal(true)
  }

  function copyLink() {
    navigator.clipboard.writeText(ACTIVATION_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button onClick={handleClick} className={`${className} ${sizeClasses[size]} inline-flex items-center gap-2`}>
        <Crown className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {label ?? 'Assinar Premium — R$ 50/mês'}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="card-dark w-full max-w-md p-6 space-y-5 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-dark-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-400/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Pagamento iniciado!</h3>
                <p className="text-dark-400 text-sm">O Mercado Pago foi aberto em nova aba.</p>
              </div>
            </div>

            <hr className="border-dark-700" />

            {/* Pix instruction */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-2">
              <p className="text-yellow-300 font-semibold text-sm">Pagou via Pix?</p>
              <p className="text-dark-300 text-sm leading-relaxed">
                Após confirmar o Pix, o acesso Premium <strong>não é liberado automaticamente</strong>.
                Clique no botão abaixo para ativar seu plano.
              </p>
            </div>

            <a
              href={ACTIVATION_URL}
              className="btn-primary w-full justify-center py-3 text-sm flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Já paguei — Ativar meu Premium
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {/* Copy link */}
            <div className="space-y-2">
              <p className="text-dark-500 text-xs text-center">ou copie o link e acesse depois</p>
              <button
                onClick={copyLink}
                className="w-full flex items-center justify-between bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-xs text-dark-300 hover:border-brand-400/50 transition-colors group"
              >
                <span className="truncate font-mono">{ACTIVATION_URL}</span>
                {copied
                  ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                  : <Copy className="w-4 h-4 text-dark-500 group-hover:text-brand-400 flex-shrink-0 ml-2 transition-colors" />
                }
              </button>
            </div>

            <p className="text-dark-600 text-xs text-center">
              Pago com cartão? O acesso é liberado automaticamente — feche esta janela.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
