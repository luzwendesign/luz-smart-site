'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { LandingPageConfig } from '@/types'
import {
  BedDouble, Bath, Car, Ruler, MapPin, Phone, Mail,
  CheckCircle, Send, Instagram, Facebook, Zap, Award
} from 'lucide-react'
import { formatWhatsApp, PROPERTY_ICONS } from '@/lib/utils'
import LeadForm from '@/components/landing/LeadForm'

const FONT_STACKS: Record<string, string> = {
  'plus-jakarta': "'Plus Jakarta Sans', sans-serif",
  'inter':        "'Inter', sans-serif",
  'poppins':      "'Poppins', sans-serif",
  'montserrat':   "'Montserrat', sans-serif",
  'raleway':      "'Raleway', sans-serif",
  'nunito':       "'Nunito', sans-serif",
  'lato':         "'Lato', sans-serif",
  'roboto':       "'Roboto', sans-serif",
  'oswald':       "'Oswald', sans-serif",
  'playfair':     "'Playfair Display', serif",
  'merriweather': "'Merriweather', serif",
  'dm-sans':      "'DM Sans', sans-serif",
}
const RADIUS_MAP: Record<string, string> = { none: '0px', small: '6px', medium: '12px', large: '16px' }
const FONT_URLS: Record<string, string> = {
  'plus-jakarta': 'Plus+Jakarta+Sans:wght@400;600;700;800;900',
  'inter':        'Inter:wght@400;600;700;800',
  'poppins':      'Poppins:wght@400;600;700;800',
  'montserrat':   'Montserrat:wght@400;600;700;800',
  'raleway':      'Raleway:wght@400;600;700;800',
  'nunito':       'Nunito:wght@400;600;700;800',
  'lato':         'Lato:wght@400;700;900',
  'roboto':       'Roboto:wght@400;500;700;900',
  'oswald':       'Oswald:wght@400;500;600;700',
  'playfair':     'Playfair+Display:wght@400;600;700;800',
  'merriweather': 'Merriweather:wght@400;700;900',
  'dm-sans':      'DM+Sans:wght@400;500;600;700',
}

export default function SlugPage() {
  const params = useParams()
  const [lp, setLp] = useState<LandingPageConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function loadFromStorage() {
      try {
        const raw = localStorage.getItem('luz-smart-site')
        if (!raw) return false
        const stored = JSON.parse(raw)
        const state = stored.state || stored
        const slug = (params.slug as string).toLowerCase()
        const pages: LandingPageConfig[] = state.landingPages || []
        const found = pages.find(
          (l) => (l.customSlug || '').toLowerCase() === slug || l.id.toLowerCase() === slug
        ) || null
        if (found) { setLp(found); setLoading(false); return true }
        return false
      } catch { return false }
    }

    if (!loadFromStorage()) {
      let tries = 0
      const interval = setInterval(() => {
        tries++
        if (loadFromStorage() || tries > 30) {
          clearInterval(interval)
          setLoading(false)
        }
      }, 100)
      return () => clearInterval(interval)
    }

    // Re-read when tab gains focus (user edited in another tab)
    const handleVisibility = () => { if (document.visibilityState === 'visible') loadFromStorage() }
    const handleFocus = () => loadFromStorage()
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!lp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-400 text-lg font-semibold mb-2">Página não encontrada</p>
          <p className="text-gray-400 text-sm">O link pode estar incorreto ou a página foi removida.</p>
        </div>
      </div>
    )
  }

  return <LandingPageFull lp={lp} />
}

function LandingPageFull({ lp }: { lp: LandingPageConfig }) {
  const { propertyData: p, primaryColor, accentColor, ctaPrimary, ctaSecondary, sections, fontFamily, borderRadius } = lp
  const enabledSections = sections.filter((s: any) => s.enabled).sort((a: any, b: any) => a.order - b.order)
  const waLink = `https://wa.me/${formatWhatsApp(p.whatsapp)}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${p.title}`)}`
  const fontStack = FONT_STACKS[fontFamily || 'plus-jakarta']
  const btnRadius = RADIUS_MAP[borderRadius || 'large']
  const fontUrl = FONT_URLS[fontFamily || 'plus-jakarta']

  return (
    <>
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`} />
      <div style={{ fontFamily: fontStack }} className="bg-white min-h-screen">

        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: primaryColor, borderRadius: btnRadius }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">{p.agencyName || 'Imobiliária'}</span>
            </div>
            <div className="flex items-center gap-3">
              <a href={`tel:${p.phone}`} className="hidden sm:flex items-center gap-2 text-gray-600 text-sm font-medium">
                <Phone className="w-4 h-4" /> {p.phone}
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 text-white text-sm font-bold shadow-lg hover:opacity-90"
                style={{ background: primaryColor, borderRadius: btnRadius }}>
                Agendar visita
              </a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        {enabledSections.find((s: any) => s.type === 'hero') && (
          <section className="relative min-h-screen flex items-center">
            {p.images[0] && (
              <div className="absolute inset-0">
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
              </div>
            )}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-white/20 bg-white/10 backdrop-blur text-white text-sm font-medium" style={{ borderRadius: '999px' }}>
                    <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    {p.neighborhood} · {p.city}, {p.state}
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">{p.title}</h1>
                  <p className="text-white/80 text-lg mb-6 max-w-lg leading-relaxed">{p.description.substring(0, 180)}...</p>
                  <div className="mb-6">
                    <p className="text-white/60 text-sm mb-1">Valor</p>
                    <p className="text-4xl font-black" style={{ color: accentColor }}>{p.priceFormatted}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {[
                      { icon: Ruler, label: `${p.area} m²`, sub: 'Área privativa' },
                      { icon: BedDouble, label: `${p.bedrooms} Quartos`, sub: `${p.suites} suíte` },
                      { icon: Bath, label: `${p.bathrooms} Banheiros`, sub: '' },
                      { icon: Car, label: `${p.parking} Vagas`, sub: '' },
                    ].map(({ icon: Icon, label, sub }) => (
                      <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 border border-white/15" style={{ borderRadius: btnRadius }}>
                        <Icon className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />
                        <div>
                          <p className="text-white font-bold text-sm">{label}</p>
                          {sub && <p className="text-white/60 text-xs">{sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <a href="#contato" className="px-8 py-4 font-bold text-gray-900 text-base shadow-xl hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, borderRadius: btnRadius }}>
                      {ctaPrimary}
                    </a>
                    <a href={waLink} target="_blank" rel="noopener noreferrer"
                      className="px-8 py-4 font-bold text-white text-base bg-green-600 hover:bg-green-500"
                      style={{ borderRadius: btnRadius }}>
                      {ctaSecondary}
                    </a>
                  </div>
                </div>
                <div className="bg-white p-7 shadow-2xl" style={{ borderRadius: '20px' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Fale com o corretor</h3>
                  <p className="text-gray-500 text-sm mb-5">Receba mais informações sobre este imóvel.</p>
                  <LeadForm
                    landingPageId={lp.id}
                    landingPageSlug={lp.customSlug}
                    landingPageTitle={p.title}
                    userId={lp.userId || lp.id}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    btnRadius={btnRadius}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FEATURES */}
        {enabledSections.find((s: any) => s.type === 'features') && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Sobre o imóvel</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { icon: BedDouble, label: `${p.bedrooms} Quartos`, sub: `${p.suites} suíte` },
                  { icon: Bath, label: `${p.bathrooms} Banheiros`, sub: '' },
                  { icon: Ruler, label: `${p.area} m²`, sub: 'privativa' },
                  { icon: Car, label: `${p.parking} Vagas`, sub: 'garagem' },
                  ...(p.features.slice(0, 2).map((f: string) => ({ icon: CheckCircle, label: f, sub: '' }))),
                ].map(({ icon: Icon, label, sub }, i) => (
                  <div key={i} className="bg-white p-5 text-center shadow-sm border border-gray-100" style={{ borderRadius: '16px' }}>
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center" style={{ background: `${primaryColor}18`, borderRadius: '12px' }}>
                      <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{label}</p>
                    {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALLERY */}
        {enabledSections.find((s: any) => s.type === 'gallery') && p.images.length > 1 && (
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Galeria de fotos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {p.images.slice(0, 8).map((img: string, i: number) => (
                  <div key={i} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                    style={{ borderRadius: '16px', aspectRatio: '4/3' }}>
                    <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PRICE BOX */}
        {enabledSections.find((s: any) => s.type === 'price_box') && (
          <section className="py-14 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Valor do imóvel</h2>
              <div className="max-w-lg mx-auto bg-white border-2 rounded-3xl shadow-xl overflow-hidden" style={{ borderColor: `${primaryColor}30` }}>
                <div className="px-8 pt-8 pb-6 text-center" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${accentColor}08)` }}>
                  <p className="text-gray-500 text-sm font-medium mb-2">Valor do imóvel</p>
                  <p className="text-5xl font-black text-gray-900 leading-none">{p.priceFormatted}</p>
                  <span className="inline-block mt-3 px-3 py-1 text-xs font-bold rounded-full text-white" style={{ background: primaryColor }}>Ótimo preço</span>
                </div>
                {(p.condoFee || p.iptu) && (
                  <div className="px-8 py-5 border-t border-gray-100 space-y-3">
                    {p.condoFee && <div className="flex justify-between text-sm"><span className="text-gray-500">Condomínio</span><span className="font-bold text-gray-900">{p.condoFee}</span></div>}
                    {p.iptu && <div className="flex justify-between text-sm"><span className="text-gray-500">IPTU</span><span className="font-bold text-gray-900">{p.iptu}</span></div>}
                  </div>
                )}
                <div className="px-8 pb-8 pt-4 space-y-3">
                  <a href="#contato" className="flex items-center justify-center gap-2 w-full py-4 font-bold text-white shadow-lg hover:opacity-90"
                    style={{ background: primaryColor, borderRadius: btnRadius }}>{ctaPrimary}</a>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 font-semibold text-gray-700 text-sm bg-gray-100 hover:bg-gray-200"
                    style={{ borderRadius: btnRadius }}>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Converse conosco agora
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ABOUT */}
        {enabledSections.find((s: any) => s.type === 'about') && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Descrição completa</h2>
              <div className="bg-white p-8 shadow-sm border border-gray-100" style={{ borderRadius: '20px' }}>
                <p className="text-gray-700 leading-relaxed text-base mb-6">{p.description}</p>
                {p.features.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Características</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {p.features.map((f: string) => (
                        <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* HIGHLIGHTS */}
        {enabledSections.find((s: any) => s.type === 'highlights') && p.highlights.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Diferenciais</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {p.highlights.map((h: string) => {
                  const emoji = Object.entries(PROPERTY_ICONS).find(([k]) => h.toLowerCase().includes(k))?.[1] || '✨'
                  return (
                    <div key={h} className="text-center p-6 border border-gray-100 hover:shadow-md transition-all" style={{ borderRadius: '16px' }}>
                      <div className="text-4xl mb-3">{emoji}</div>
                      <p className="font-semibold text-gray-900">{h}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA MID */}
        {enabledSections.find((s: any) => s.type === 'cta_mid') && (
          <section className="py-16" style={{ background: `linear-gradient(135deg, ${primaryColor}18, ${accentColor}10)` }}>
            <div className="max-w-3xl mx-auto px-6 text-center">
              <Award className="w-14 h-14 mx-auto mb-4" style={{ color: primaryColor }} />
              <h2 className="text-3xl font-black text-gray-900 mb-4">Não perca esta oportunidade!</h2>
              <p className="text-gray-600 text-lg mb-8">Entre em contato agora e agende uma visita sem compromisso.</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a href="#contato" className="px-8 py-4 font-bold text-gray-900 hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, borderRadius: btnRadius }}>Agendar visita</a>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 font-bold text-white bg-green-600 hover:bg-green-500" style={{ borderRadius: btnRadius }}>WhatsApp</a>
              </div>
            </div>
          </section>
        )}

        {/* LOCATION */}
        {enabledSections.find((s: any) => s.type === 'location') && (
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-black text-gray-900 text-center mb-4">Localização</h2>
              <p className="text-gray-500 text-center mb-10 flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                {p.address} — {p.neighborhood}, {p.city} - {p.state}
              </p>
              <div className="overflow-hidden shadow-sm border border-gray-100" style={{ borderRadius: '16px', height: '420px' }}>
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${p.address}, ${p.city}, ${p.state}, Brasil`)}&output=embed&z=15`}
                  className="w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        )}

        {/* AGENT */}
        {enabledSections.find((s: any) => s.type === 'agent') && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-xl mx-auto px-6 text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black"
                style={{ background: `${primaryColor}20`, color: primaryColor }}>
                {p.agentName.charAt(0)}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{p.agentName}</h3>
              {p.agentCRECI && <p className="text-gray-500 text-sm mb-1">{p.agentCRECI}</p>}
              <p className="text-gray-600 text-sm mb-6">{p.agencyName}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a href={`tel:${p.phone}`} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:shadow-md" style={{ borderRadius: btnRadius }}>
                  <Phone className="w-4 h-4" /> {p.phone}
                </a>
                <a href={`mailto:${p.email}`} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:shadow-md" style={{ borderRadius: btnRadius }}>
                  <Mail className="w-4 h-4" /> E-mail
                </a>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-medium text-sm hover:bg-green-500" style={{ borderRadius: btnRadius }}>
                  <Send className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </section>
        )}

        {/* CONTACT */}
        {enabledSections.find((s: any) => s.type === 'contact') && (
          <section id="contato" className="py-16 bg-white">
            <div className="max-w-xl mx-auto px-6">
              <h2 className="text-3xl font-black text-gray-900 text-center mb-4">Entre em contato</h2>
              <p className="text-gray-500 text-center mb-10">Preencha o formulário e responderemos em até 2 horas</p>
              <div className="bg-gray-50 p-8 border border-gray-100" style={{ borderRadius: '20px' }}>
                <LeadForm
                  landingPageId={lp.id}
                  landingPageSlug={lp.customSlug}
                  landingPageTitle={p.title}
                  userId={lp.userId || lp.id}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  btnRadius={btnRadius}
                />
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        {enabledSections.find((s: any) => s.type === 'footer') && (
          <footer className="py-12 bg-gray-900">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 flex items-center justify-center" style={{ background: primaryColor, borderRadius: '8px' }}>
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg">{p.agencyName}</span>
                  </div>
                  {p.agentCRECI && <p className="text-gray-500 text-sm">{p.agentCRECI}</p>}
                  <p className="text-gray-500 text-sm">{p.phone} · {p.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {p.instagram && (
                    <a href={`https://instagram.com/${(p.instagram||'').replace(/^@/,'')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white text-xs font-medium">
                      <Instagram className="w-4 h-4" /> {p.instagram}
                    </a>
                  )}
                  {p.facebook && (
                    <a href={`https://facebook.com/${p.facebook}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white text-xs font-medium">
                      <Facebook className="w-4 h-4" /> Facebook
                    </a>
                  )}
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-700 rounded-xl text-white text-xs font-medium">
                    <Send className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
                <p className="text-gray-600 text-xs">© {new Date().getFullYear()} {p.agencyName}. Todos os direitos reservados.</p>
                <p className="text-gray-700 text-xs">Powered by <span style={{ color: primaryColor }}>Luz Smart Site</span></p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  )
}
