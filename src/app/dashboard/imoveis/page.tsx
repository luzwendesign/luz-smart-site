'use client'
import TopBar from '@/components/layout/TopBar'
import Link from 'next/link'
import { Plus, Home } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function ImoveisPage() {
  const { landingPages } = useAppStore()

  return (
    <div className="min-h-screen bg-dark-950">
      <TopBar
        title="Imóveis"
        subtitle="Gerencie seus imóveis"
        actions={
          <Link href="/dashboard/novo" className="btn-primary text-sm py-2.5 px-4">
            <Plus className="w-4 h-4" /> Adicionar imóvel
          </Link>
        }
      />
      <div className="p-6">
        {landingPages.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-dark-800 flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-dark-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum imóvel ainda</h3>
            <p className="text-dark-400 mb-8">Cole o link de um imóvel para criar sua primeira landing page.</p>
            <Link href="/dashboard/novo" className="btn-primary inline-flex">
              <Plus className="w-4 h-4" /> Adicionar imóvel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {landingPages.map((lp) => (
              <Link key={lp.id} href={`/dashboard/editor/${lp.id}`} className="card-dark hover:border-dark-600">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-800 flex-shrink-0">
                    {lp.propertyData.images[0] && (
                      <img src={lp.propertyData.images[0]} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-0.5">{lp.propertyData.title}</h3>
                    <p className="text-dark-400 text-xs">{lp.propertyData.city}</p>
                    <p className="text-brand-400 text-sm font-semibold mt-1">{lp.propertyData.priceFormatted}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
