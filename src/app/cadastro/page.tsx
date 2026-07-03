'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { registerUser } from '@/lib/auth'
import { useAppStore } from '@/lib/store'

export default function CadastroPage() {
  const router = useRouter()
  const { setUser } = useAppStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', creci: '', phone: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setError('')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Nome, e-mail e senha são obrigatórios.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    setError('')

    await new Promise((r) => setTimeout(r, 400))

    const result = registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      creci: form.creci,
      phone: form.phone,
    })

    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }

    setUser(result.user)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-xl">
              <Sparkles className="w-5 h-5 text-dark-950" />
            </div>
            <h1 className="text-2xl font-black gradient-text" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Luz Smart Site
            </h1>
          </div>
          <p className="text-dark-400 text-sm">Crie sua conta e comece a usar grátis</p>
        </div>

        {/* Trial banner */}
        <div className="flex items-center gap-2 justify-center mb-6 flex-wrap">
          {['✅ 3 dias grátis', '🔒 Sem cartão', '⚡ Página em 60s'].map((t) => (
            <span key={t} className="text-dark-400 text-xs bg-dark-800 px-3 py-1.5 rounded-full">{t}</span>
          ))}
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Criar conta grátis</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dark-400 mb-1.5">Nome completo *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="João Silva"
                className="input-dark w-full"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-400 mb-1.5">E-mail *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="seu@email.com"
                className="input-dark w-full"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-400 mb-1.5">Senha *</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="input-dark w-full pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-dark-400 mb-1.5">CRECI</label>
                <input
                  type="text"
                  value={form.creci}
                  onChange={(e) => update('creci', e.target.value)}
                  placeholder="CRECI-SP 123456"
                  className="input-dark w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-400 mb-1.5">Telefone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="input-dark w-full"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-2.5 rounded-xl border border-red-400/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {loading ? 'Criando conta...' : 'Criar conta grátis'}
            </button>
          </form>

          <p className="text-center text-dark-500 text-sm mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-brand-400 font-semibold hover:text-brand-300">
              Entrar
            </Link>
          </p>
        </div>

        <p className="text-center text-dark-600 text-xs mt-6">
          Ao criar sua conta você concorda com os termos de uso.
        </p>
      </div>
    </div>
  )
}
