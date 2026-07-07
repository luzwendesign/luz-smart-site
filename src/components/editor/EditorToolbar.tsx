'use client'
import { useRouter } from 'next/navigation'
import {
  Monitor, Tablet, Smartphone, Eye, ArrowLeft,
  Save, Globe, CheckCircle, Loader2, Download
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function EditorToolbar() {
  const router = useRouter()
  const { previewDevice, setPreviewDevice, currentLP, updateCurrentLP, updateLandingPage, isGenerating } = useAppStore()
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  if (!currentLP) return null

  async function handleSave() {
    setSaving(true)
    // Sincroniza currentLP → landingPages (persiste no localStorage e dispara storage event no link)
    updateLandingPage(currentLP!.id, currentLP!)
    await new Promise((r) => setTimeout(r, 400))
    setSaving(false)
    toast.success('Alterações salvas!')
  }

  async function handlePublish() {
    setPublishing(true)
    await new Promise((r) => setTimeout(r, 1500))
    updateCurrentLP({ published: true, publishedAt: new Date().toISOString() })
    setPublishing(false)
    toast.success('🎉 Landing page publicada com sucesso!')
  }

  const steps = [
    { n: 1, label: 'Imóvel' },
    { n: 2, label: 'Modelo' },
    { n: 3, label: 'Personalizar' },
    { n: 4, label: 'Publicar' },
  ]

  return (
    <header className="h-14 bg-dark-950 border-b border-dark-800 flex items-center justify-between px-4 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
        <div className="h-5 w-px bg-dark-800" />
        <h2 className="text-sm font-bold text-white truncate max-w-[160px]" title={currentLP.propertyData.title}>
          {currentLP.propertyData.title}
        </h2>
      </div>

      {/* Steps */}
      <div className="hidden md:flex items-center gap-1">
        {steps.map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-1">
            <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
              n < 3 ? 'step-completed' : n === 3 ? 'step-active' : 'step-inactive'
            )}>
              {n < 3 ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{n}</span>}
              {label}
            </div>
            {i < steps.length - 1 && <div className="w-6 h-px bg-dark-700" />}
          </div>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Device switcher */}
        <div className="flex items-center bg-dark-800 rounded-lg p-0.5">
          {([
            { id: 'desktop', Icon: Monitor },
            { id: 'tablet', Icon: Tablet },
            { id: 'mobile', Icon: Smartphone },
          ] as const).map(({ id, Icon }) => (
            <button
              key={id}
              onClick={() => setPreviewDevice(id)}
              className={cn(
                'p-1.5 rounded-md transition-all',
                previewDevice === id ? 'bg-dark-600 text-white' : 'text-dark-500 hover:text-dark-300'
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-secondary text-sm py-2 px-3"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span className="hidden sm:inline">Salvar</span>
        </button>

        <button
          onClick={() => window.open(`/preview/${currentLP.id}`, '_blank')}
          className="btn-secondary text-sm py-2 px-3"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Visualizar</span>
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="btn-primary text-sm py-2 px-4"
        >
          {publishing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : currentLP.published ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          {currentLP.published ? 'Publicado' : 'Publicar site'}
        </button>
      </div>
    </header>
  )
}
