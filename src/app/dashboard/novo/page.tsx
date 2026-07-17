'use client'
import { useAppStore } from '@/lib/store'
import UrlExtractor from '@/components/generator/UrlExtractor'
import { Crown, Lock } from 'lucide-react'
import PremiumButton from '@/components/ui/PremiumButton'
import { getEffectivePlan } from '@/lib/blocklist'

export default function NovoPage() {
  const { user, totalLPsCreated } = useAppStore()
  const isPremium = getEffectivePlan(user?.email, user?.plan ?? 'free') === 'premium'
  const atLimit = !isPremium && totalLPsCreated >= 1

  if (atLimit) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6">
        <div className="card-dark max-w-md w-full text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-400/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Limite do plano gratuito</h2>
          <p className="text-dark-400 text-sm mb-6">
            O plano gratuito permite apenas <strong className="text-white">1 landing page</strong>.
            Faça upgrade para o Premium e crie sites ilimitados para todos os seus imóveis.
          </p>
          <div className="space-y-3">
            <PremiumButton className="btn-primary w-full justify-center" size="lg" />
            <a href="/dashboard/sites" className="block text-sm text-dark-400 hover:text-white transition-colors">
              Voltar para Meus Sites
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-dark-800 grid grid-cols-2 gap-3 text-left">
            {['Sites ilimitados', 'Domínio personalizado', 'Pixel Meta & Analytics', 'Exportar leads CSV', 'Suporte prioritário', 'Sem marca d\'água'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-dark-300">
                <span className="text-brand-400">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <UrlExtractor />
}
