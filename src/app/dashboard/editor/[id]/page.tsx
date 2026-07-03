'use client'
import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import EditorToolbar from '@/components/editor/EditorToolbar'
import EditorPanel from '@/components/editor/EditorPanel'
import LandingPreview from '@/components/editor/LandingPreview'

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const { currentLP, landingPages, setCurrentLP } = useAppStore()

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
        <EditorPanel />
        <LandingPreview />
      </div>
    </div>
  )
}
