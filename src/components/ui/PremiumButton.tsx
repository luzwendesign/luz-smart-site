'use client'
import { useState } from 'react'
import { Crown, X, CheckCircle, Zap, AlertTriangle, ArrowRight } from 'lucide-react'

const MP_LINK = 'https://mpago.la/2jcbcsh'

interface PremiumButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export default function PremiumButton({ className = 'btn-primary', size = 'md', label }: PremiumButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState<'info' | 'pix'>('info')
  const [pixId, setPixId] = useState('')
  const [error, setError] = useState('')

  const sizeClasses = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2.5 px-5',
    lg: 'text-base py-3 px-6',
  }

  function handleClick() {
    window.open(MP_LINK, '_blank')
    setShowModal(true)
    setStep('info')
    setPixId('')
    setError('')
  }

  function handleClose() {
    setShowModal(false)
    setStep('info')
    setPixId('')
    setError('')
  }

  function isValidMPId(id: string): boolean {
    // Formato E2E do Banco Central: E + 29-34 chars alfanuméricos
    if (/^E[A-Z0-9]{20,34}$/i.test(id)) return true
    // Identificador interno MP: mpqrinter + dígitos
    if (/^mpqrinter\d{8,}$/i.test(id)) return true
    // Outros formatos MP: sequências longas alfanuméricas sem espaço (min 20 chars)
    if (/^[A-Z0-9]{20,}$/i.test(id)) return true
    return false
  }

  function handleActivate() {
    const clean = pixId.trim().replace(/\s+/g, '')
    if (!isValidMPId(clean)) {
      setError('ID inválido. Cole o identificador exato do comprovante Pix (ex: E60701...DY58 ou mpqrinter169...). Números genéricos não são aceitos.')
      return
    }
    window.location.href = `/ativacao?collection_status=approved&payment_id=${encodeURIComponent(clean)}`
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
            <button onClick={handleClose} className="absolute top-4 right-4 text-dark-500 hover:text-white transition-colors">
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

            {step === 'info' && (
              <>
                <div className="space-y-3">
                  {/* Cartão */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-300 font-semibold text-sm mb-1">Pagou com cartão?</p>
                    <p className="text-dark-300 text-sm">
                      O acesso é liberado automaticamente assim que o MP confirmar. <strong className="text-white">Feche esta janela</strong> e aguarde alguns instantes.
                    </p>
                  </div>

                  {/* Pix */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-yellow-300 font-semibold text-sm mb-1">Pagou via Pix?</p>
                    <p className="text-dark-300 text-sm">
                      Após confirmar o pagamento Pix, clique abaixo para ativar seu plano informando o ID da transação.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep('pix')}
                  className="btn-primary w-full justify-center py-3 text-sm"
                >
                  <Crown className="w-4 h-4" />
                  Já paguei via Pix — Ativar agora
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-dark-600 text-xs text-center">
                  Não pagou ainda? Finalize o pagamento no Mercado Pago e volte aqui.
                </p>
              </>
            )}

            {step === 'pix' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white block">
                    ID da transação Pix
                  </label>
                  <p className="text-dark-400 text-xs">
                    Encontre o ID no comprovante Pix do seu banco (campo "Identificador", "ID E2E" ou "Código da transação").
                  </p>
                  <input
                    type="text"
                    value={pixId}
                    onChange={(e) => { setPixId(e.target.value); setError('') }}
                    placeholder="Ex: E60701190202607161700DY58ZVPDMVU"
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-400 font-mono"
                  />
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleActivate}
                  disabled={pixId.trim().length < 10}
                  className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirmar e ativar Premium
                </button>

                <button onClick={() => setStep('info')} className="w-full text-xs text-dark-500 hover:text-dark-300 transition-colors">
                  ← Voltar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
