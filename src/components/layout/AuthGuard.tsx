'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { useHydrated } from '@/lib/useHydrated'
import { Sparkles } from 'lucide-react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAppStore()
  const hydrated = useHydrated()

  useEffect(() => {
    // Só redireciona após hidratação — evita logout falso no primeiro render SSR
    if (hydrated && !user) {
      router.replace('/login')
    }
  }, [hydrated, user, router])

  // Enquanto não hidratou: mostra loading (não redireciona)
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-dark-950" />
          </div>
          <p className="text-dark-400 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  // Hidratou e não tem usuário: aguarda o redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-dark-950" />
          </div>
          <p className="text-dark-400 text-sm">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
