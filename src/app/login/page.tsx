'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { loginUser } from '@/lib/auth'
import { useAppStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Preencha e-mail e senha.'); return }
    setLoading(true)
    setError('')

    // Small delay to feel natural
    await new Promise((r) => setTimeout(r, 400))

    const result = loginUser(email, password)
    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }

    setUser(result.user)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
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
          <p className="text-dark-400 text-sm">Acesse sua conta para continuar</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Entrar</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dark-400 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="seu@email.com"
                className="input-dark w-full"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-400 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  className="input-dark w-full pr-10"
                  autoComplete="current-password"
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-dark-500 text-sm mt-6">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-brand-400 font-semibold hover:text-brand-300">
              Criar conta grátis
            </Link>
          </p>
        </div>

        <p className="text-center text-dark-600 text-xs mt-6">
          Teste grátis por 3 dias · Sem cartão de crédito
        </p>
      </div>
    </div>
  )
}
