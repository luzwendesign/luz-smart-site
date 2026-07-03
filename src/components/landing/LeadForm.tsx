'use client'
import { useState } from 'react'
import { Shield, Loader2, CheckCircle } from 'lucide-react'

interface LeadFormProps {
  landingPageId: string
  landingPageSlug?: string
  landingPageTitle: string
  userId: string
  primaryColor: string
  accentColor: string
  btnRadius: string
  compact?: boolean
}

export default function LeadForm({
  landingPageId, landingPageSlug, landingPageTitle,
  userId, primaryColor, accentColor, btnRadius, compact = false
}: LeadFormProps) {
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Informe seu nome.'); return }
    if (!form.whatsapp.trim()) { setError('Informe seu WhatsApp.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landingPageId,
          landingPageSlug,
          landingPageTitle,
          userId,
          name: form.name,
          whatsapp: form.whatsapp,
          email: form.email,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-bold text-gray-900 text-base">Mensagem enviada!</h3>
        <p className="text-gray-500 text-sm">O corretor entrará em contato em breve.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input
        className={`w-full bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none placeholder-gray-400 ${compact ? 'px-3 py-2.5 text-xs rounded-lg' : 'px-4 py-3.5 text-sm rounded-xl'}`}
        placeholder="Nome completo *"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
      />
      <input
        className={`w-full bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none placeholder-gray-400 ${compact ? 'px-3 py-2.5 text-xs rounded-lg' : 'px-4 py-3.5 text-sm rounded-xl'}`}
        placeholder="WhatsApp *"
        value={form.whatsapp}
        onChange={(e) => update('whatsapp', e.target.value)}
      />
      <input
        className={`w-full bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none placeholder-gray-400 ${compact ? 'px-3 py-2.5 text-xs rounded-lg' : 'px-4 py-3.5 text-sm rounded-xl'}`}
        placeholder="E-mail"
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-bold text-gray-900 shadow-lg hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 ${compact ? 'py-2.5 text-xs rounded-lg' : 'py-4 text-sm rounded-xl'}`}
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, borderRadius: btnRadius }}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Enviando...' : 'Quero mais informações'}
      </button>

      <p className={`text-center text-gray-400 flex items-center justify-center gap-1 ${compact ? 'text-xs' : 'text-xs'}`}>
        <Shield className="w-3 h-3" /> Atendimento rápido e seguro
      </p>
    </form>
  )
}
