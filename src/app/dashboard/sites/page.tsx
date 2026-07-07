'use client'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import TopBar from '@/components/layout/TopBar'
import { Plus, Edit, Trash2, Globe, CheckCircle, Eye, Crown, Lock, Copy, ExternalLink, Share2 } from 'lucide-react'
import { useState } from 'react'

function SiteCard({ lp, isPremium, onDelete, updateLP }: { lp: any; isPremium: boolean; onDelete: () => void; updateLP: (patch: any) => void }) {
  const [copied, setCopied] = useState(false)
  const [editingSlug, setEditingSlug] = useState(false)
  const [slugInput, setSlugInput] = useState(lp.customSlug || '')
  const [slugSaved, setSlugSaved] = useState(false)

  const slug = lp.customSlug || lp.id
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://luz-smart-site.vercel.app'
  const shareUrl = `${baseUrl}/p/${slug}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function saveSlug() {
    const clean = slugInput.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    if (clean) {
      updateLP({ customSlug: clean })
      setSlugSaved(true)
      setTimeout(() => { setSlugSaved(false); setEditingSlug(false) }, 1500)
    }
  }

  return (
    <div className="card-dark p-0 overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-44 bg-dark-800">
        {lp.propertyData.images[0] ? (
          <img src={lp.propertyData.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe className="w-12 h-12 text-dark-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60" />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {lp.published ? (
            <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full font-semibold">
              <CheckCircle className="w-3 h-3" /> Publicado
            </span>
          ) : (
            <span className="text-xs bg-dark-800/80 text-dark-400 border border-dark-700 px-2 py-1 rounded-full font-medium">
              Rascunho
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/dashboard/editor/${lp.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-white text-dark-900 rounded-lg">
            <Edit className="w-3.5 h-3.5" /> Editar
          </Link>
          <a href={`/preview/${lp.id}`} target="_blank" rel="noopener noreferrer"
            className="py-2 px-3 text-xs font-bold bg-white/10 text-white rounded-lg backdrop-blur-sm border border-white/20">
            <Eye className="w-3.5 h-3.5" />
          </a>
          <button onClick={onDelete} className="py-2 px-3 text-xs font-bold bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-white text-sm mb-0.5 truncate">{lp.propertyData.title}</h3>
          <p className="text-dark-400 text-xs">{lp.propertyData.city} · {lp.propertyData.priceFormatted}</p>
        </div>

        {/* Link de compartilhamento */}
        <div className="bg-dark-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-dark-300 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-brand-400" /> Link do site
            </p>
            {isPremium && !editingSlug && (
              <button onClick={() => { setEditingSlug(true); setSlugInput(lp.customSlug || '') }}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium">
                Personalizar
              </button>
            )}
            {!isPremium && (
              <span className="text-xs text-dark-600 flex items-center gap-1">
                <Crown className="w-3 h-3 text-brand-400" /> Premium
              </span>
            )}
          </div>

          {/* URL display */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 flex items-center gap-1.5 bg-dark-900 rounded-lg px-2.5 py-2 min-w-0">
              <Globe className="w-3 h-3 text-dark-500 flex-shrink-0" />
              <span className="text-xs text-dark-300 font-mono truncate">/p/{slug.length > 20 ? slug.slice(0, 20) + '…' : slug}</span>
            </div>
            <button onClick={copyLink} title="Copiar link"
              className="p-2 rounded-lg bg-dark-900 text-dark-500 hover:text-brand-400 transition-colors flex-shrink-0">
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" title="Abrir site"
              className="p-2 rounded-lg bg-dark-900 text-dark-500 hover:text-brand-400 transition-colors flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Edição de slug — só Premium */}
          {isPremium && editingSlug && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-dark-500 whitespace-nowrap">/p/</span>
                <input
                  className="input-dark text-xs py-1.5 flex-1"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                  placeholder="nome-da-empresa"
                  autoFocus
                />
              </div>
              <div className="flex gap-1.5">
                <button onClick={saveSlug}
                  className="flex-1 py-1.5 text-xs font-bold bg-brand-400 text-dark-950 rounded-lg hover:bg-brand-300 transition-colors">
                  {slugSaved ? '✓ Salvo!' : 'Salvar'}
                </button>
                <button onClick={() => setEditingSlug(false)}
                  className="px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
              <p className="text-xs text-dark-600">Apenas letras, números e hífens.</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-dark-500">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 0 views</span>
          <span>Criado {new Date(lp.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  )
}

export default function SitesPage() {
  const { landingPages, deleteLandingPage, updateLandingPage, user } = useAppStore()
  const isPremium = user?.plan === 'premium'
  const atLimit = !isPremium && landingPages.length >= 1

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar
        title="Meus Sites"
        subtitle={`${landingPages.length} landing page${landingPages.length !== 1 ? 's' : ''}`}
        actions={
          atLimit ? (
            <a href="https://mpago.la/2jcbcsh" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2.5 px-4">
              <Crown className="w-4 h-4" /> Fazer upgrade
            </a>
          ) : (
            <Link href="/dashboard/novo" className="btn-primary text-sm py-2.5 px-4">
              <Plus className="w-4 h-4" /> Criar novo
            </Link>
          )
        }
      />

      <div className="p-4 md:p-6">
        {atLimit && (
          <div className="mb-6 flex items-start gap-3 bg-brand-400/10 border border-brand-400/30 rounded-xl p-4">
            <Crown className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-400">Limite do plano gratuito atingido</p>
              <p className="text-xs text-dark-400 mt-0.5">
                No plano gratuito você pode ter apenas <strong className="text-white">1 landing page</strong>.
                Faça upgrade para criar sites ilimitados e personalizar os links.
              </p>
            </div>
            <a href="https://mpago.la/2jcbcsh" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 px-3 flex-shrink-0">
              <Crown className="w-3.5 h-3.5" /> R$ 50/mês
            </a>
          </div>
        )}

        {landingPages.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-dark-800 flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-dark-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhuma landing page ainda</h3>
            <p className="text-dark-400 mb-8">Cole o link de um imóvel e gere sua primeira página em 60 segundos.</p>
            <Link href="/dashboard/novo" className="btn-primary inline-flex">
              <Plus className="w-4 h-4" /> Criar minha primeira página
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {landingPages.map((lp) => (
              <SiteCard
                key={lp.id}
                lp={lp}
                isPremium={isPremium}
                onDelete={() => { if (confirm('Excluir esta landing page?')) deleteLandingPage(lp.id) }}
                updateLP={(patch) => updateLandingPage(lp.id, patch)}
              />
            ))}

            {atLimit && (
              <div className="card-dark p-0 overflow-hidden border-dashed border-brand-500/30 bg-brand-400/5">
                <div className="h-44 flex flex-col items-center justify-center gap-3 p-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-400/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-brand-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white mb-1">Sites ilimitados</p>
                    <p className="text-xs text-dark-400">Disponível no Premium</p>
                  </div>
                  <a href="https://mpago.la/2jcbcsh" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 px-4">
                    <Crown className="w-3.5 h-3.5" /> Assinar
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
