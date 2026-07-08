'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import EditorToolbar from '@/components/editor/EditorToolbar'
import EditorPanel from '@/components/editor/EditorPanel'
import LandingPreview from '@/components/editor/LandingPreview'
import { SlidersHorizontal, Eye } from 'lucide-react'

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const { currentLP, landingPages, setCurrentLP } = useAppStore()
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')

  useEffect(() => {
    const id = params.id as string
    if (!currentLP || currentLP.id !== id) {
      const lp = landingPages.find((l) => l.id === id)
      if (lp) {
        setCurrentLP(lp)
      } else if (landingPages.length === 0) {
        router.push('/dashboard/novo')
      }
    }
  }, [params.id])

  if (!currentLP) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-brand-400 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Carregando editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dark-950">
      <EditorToolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Painel de edição — desktop: sempre visível | mobile: só quando mobileView='edit' */}
        <div className={`${mobileView === 'edit' ? 'flex' : 'hidden'} md:flex flex-col h-full`}>
          <EditorPanel />
        </div>

        {/* Preview — desktop: sempre visível | mobile: só quando mobileView='preview' */}
        <div className={`${mobileView === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 overflow-hidden`}>
          <LandingPreview />
        </div>
      </div>

      {/* Botão flutuante mobile para alternar entre Editar e Preview */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center bg-dark-800 border border-dark-700 rounded-full shadow-2xl p-1 gap-1">
          <button
            onClick={() => setMobileView('edit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              mobileView === 'edit'
                ? 'bg-brand-400 text-dark-950'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              mobileView === 'preview'
                ? 'bg-brand-400 text-dark-950'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}
