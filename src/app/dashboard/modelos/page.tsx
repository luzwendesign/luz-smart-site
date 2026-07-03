'use client'
import TopBar from '@/components/layout/TopBar'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { createDefaultLP } from '@/lib/utils'
import { DEMO_PROPERTY } from '@/lib/mockData'
import { Crown } from 'lucide-react'

const MODELS = [
  {
    id: 'moderno',
    name: 'Moderno',
    desc: 'Dark mode com destaques em âmbar. Alta conversão.',
    tag: 'Mais popular',
    free: true,
    preview: 'bg-gradient-to-br from-gray-900 to-gray-800',
    accent: '#f59e0b',
    selected: true,
  },
  {
    id: 'clean',
    name: 'Clean',
    desc: 'Branco e minimalista. Transmite profissionalismo.',
    tag: null,
    free: true,
    preview: 'bg-white',
    accent: '#0ea5e9',
  },
  {
    id: 'minimalista',
    name: 'Minimalista',
    desc: 'Ultra limpo. Foco total no imóvel.',
    tag: null,
    free: false,
    preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
    accent: '#1e293b',
  },
  {
    id: 'luxo',
    name: 'Luxo',
    desc: 'Dark premium com dourado. Para imóveis de alto padrão.',
    tag: 'Premium',
    free: false,
    preview: 'bg-gradient-to-br from-gray-950 to-gray-900',
    accent: '#d4af37',
  },
]

export default function ModelosPage() {
  const router = useRouter()
  const { currentLP, setCurrentLP, addLandingPage } = useAppStore()

  function handleSelectModel(modelId: string) {
    const lp = createDefaultLP({
      ...DEMO_PROPERTY,
      extractedAt: new Date().toISOString(),
    })
    setCurrentLP(lp)
    addLandingPage(lp)
    router.push(`/dashboard/editor/${lp.id}`)
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar title="Modelos" subtitle="Escolha o modelo ideal para seu imóvel" />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODELS.map((model) => (
            <div key={model.id} className="card-dark overflow-hidden p-0 group cursor-pointer" onClick={() => handleSelectModel(model.id)}>
              {/* Preview */}
              <div className={`h-48 ${model.preview} relative flex items-end p-4`}>
                {/* Mini LP preview */}
                <div className="w-full space-y-2">
                  <div className="h-3 rounded-full" style={{ background: model.accent, width: '70%' }} />
                  <div className="h-2 bg-white/20 rounded-full w-full" />
                  <div className="h-2 bg-white/20 rounded-full w-4/5" />
                  <div className="h-6 rounded-lg" style={{ background: model.accent, width: '40%' }} />
                </div>
                {model.tag && (
                  <div className="absolute top-3 right-3">
                    <span className="badge-premium text-xs flex items-center gap-1">
                      {!model.free && <Crown className="w-3 h-3" />}
                      {model.tag}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white">{model.name}</h3>
                  {!model.free && <Crown className="w-4 h-4 text-brand-400" />}
                </div>
                <p className="text-dark-400 text-sm mb-4">{model.desc}</p>
                <button
                  className={model.free ? 'btn-primary w-full justify-center text-sm py-2.5' : 'btn-secondary w-full justify-center text-sm py-2.5'}
                >
                  {model.free ? 'Usar este modelo' : 'Desbloquear — Premium'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
