'use client'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import TopBar from '@/components/layout/TopBar'
import { Plus, ExternalLink, Edit, Trash2, Globe, CheckCircle, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SitesPage() {
  const { landingPages, deleteLandingPage } = useAppStore()

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar
        title="Meus Sites"
        subtitle={`${landingPages.length} landing page${landingPages.length !== 1 ? 's' : ''}`}
        actions={
          <Link href="/dashboard/novo" className="btn-primary text-sm py-2.5 px-4">
            <Plus className="w-4 h-4" /> Criar novo
          </Link>
        }
      />
      <div className="p-6">
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
              <div key={lp.id} className="card-dark p-0 overflow-hidden group">
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
                    <a
                      href={`/preview/${lp.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 text-xs font-bold bg-white/10 text-white rounded-lg backdrop-blur-sm border border-white/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => { if (confirm('Excluir esta landing page?')) deleteLandingPage(lp.id) }}
                      className="py-2 px-3 text-xs font-bold bg-red-500/20 text-red-400 rounded-lg border border-red-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1 truncate">{lp.propertyData.title}</h3>
                  <p className="text-dark-400 text-xs mb-2">
                    {lp.propertyData.city} · {lp.propertyData.priceFormatted}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-dark-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 0 views</span>
                    <span>Criado {new Date(lp.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
