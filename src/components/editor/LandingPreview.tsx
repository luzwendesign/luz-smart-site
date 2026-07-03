'use client'
import { useAppStore } from '@/lib/store'
import { formatWhatsApp, PROPERTY_ICONS } from '@/lib/utils'
import {
  BedDouble, Bath, Car, Ruler, MapPin, Phone, Mail,
  CheckCircle, Send, Instagram, Facebook, Shield,
  Zap, Award
} from 'lucide-react'

export default function LandingPreview() {
  const { currentLP, previewDevice } = useAppStore()

  if (!currentLP) return null

  const deviceClass = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[390px] mx-auto',
  }[previewDevice]

  const isMobile = previewDevice === 'mobile'
  const isTablet = previewDevice === 'tablet'

  return (
    <div className="flex-1 bg-dark-900 overflow-auto">
      <div className={`${deviceClass} transition-all duration-300`}>
        <LandingPage lp={currentLP} isMobile={isMobile} isTablet={isTablet} />
      </div>
    </div>
  )
}

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

const RADIUS_MAP: Record<string, string> = {
  none:   '0px',
  small:  '6px',
  medium: '12px',
  large:  '16px',
}

const FONT_URLS: Record<string, string> = {
  'plus-jakarta': 'Plus+Jakarta+Sans:wght@400;500;600;700;800;900',
  'inter':        'Inter:wght@300;400;500;600;700;800',
  'poppins':      'Poppins:wght@300;400;500;600;700;800',
  'montserrat':   'Montserrat:wght@300;400;500;600;700;800',
  'raleway':      'Raleway:wght@300;400;500;600;700;800',
  'nunito':       'Nunito:wght@300;400;500;600;700;800',
  'lato':         'Lato:wght@300;400;700;900',
  'roboto':       'Roboto:wght@300;400;500;700;900',
  'oswald':       'Oswald:wght@300;400;500;600;700',
  'playfair':     'Playfair+Display:wght@400;500;600;700;800',
  'merriweather': 'Merriweather:wght@300;400;700;900',
  'dm-sans':      'DM+Sans:wght@300;400;500;600;700',
}

const FONT_SIZE_SCALE: Record<string, string> = {
  small:  '90%',
  normal: '100%',
  large:  '110%',
  xlarge: '120%',
}

function LandingPage({ lp, isMobile, isTablet }: { lp: any; isMobile: boolean; isTablet: boolean }) {
  const { propertyData: p, primaryColor, accentColor, ctaPrimary, ctaSecondary, sections, fontFamily, borderRadius, fontSize } = lp

  const enabledSections = sections.filter((s: any) => s.enabled).sort((a: any, b: any) => a.order - b.order)

  const waLink = `https://wa.me/${formatWhatsApp(p.whatsapp)}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${p.title}`)}`

  const fontStack = FONT_STACKS[fontFamily || 'plus-jakarta'] || FONT_STACKS['plus-jakarta']
  const btnRadius = RADIUS_MAP[borderRadius || 'large'] || '16px'
  const fontScale = FONT_SIZE_SCALE[fontSize || 'normal'] || '100%'
  const fontUrl = FONT_URLS[fontFamily || 'plus-jakarta']

  const style = {
    '--primary': primaryColor,
    '--accent': accentColor,
    fontFamily: fontStack,
    fontSize: fontScale,
  } as React.CSSProperties

  // Derived layout flags
  const sm = !isMobile                    // show sm: content
  const md = !isMobile && !isTablet       // show md: content (desktop only in context of editor columns)
  const heroTitleSize = isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl'

  return (
    <div style={style} className="bg-white overflow-x-hidden">
      {fontUrl && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`}
        />
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-3 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: primaryColor }}>
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm truncate max-w-[130px]">{p.agencyName || 'Luz Smart Site'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {sm && (
              <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-gray-600 text-xs font-medium">
                <Phone className="w-3 h-3" /> {p.phone}
              </a>
            )}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg text-white text-xs font-bold shadow hover:opacity-90"
              style={{ background: primaryColor }}
            >
              {isMobile ? 'Visita' : 'Agendar visita'}
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      {enabledSections.find((s: any) => s.type === 'hero') && (
        <section className="relative flex items-start" style={{ minHeight: isMobile ? 'auto' : '85vh' }}>
          {p.images[0] && (
            <div className={`${isMobile ? 'absolute inset-0' : 'absolute inset-0'}`}>
              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
            </div>
          )}

          <div className={`relative z-10 w-full px-3 ${isMobile ? 'py-5' : 'py-10'}`} style={isMobile ? { paddingBottom: '1.25rem' } : {}}>
            {isMobile ? (
              /* Mobile hero — single column, stacked, compact */
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white text-xs font-medium border border-white/20">
                  <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />
                  <span className="truncate">{p.neighborhood} · {p.city}</span>
                </div>
                <h1 className="text-2xl font-black text-white leading-tight">{p.title}</h1>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-0.5">Valor</p>
                    <p className="text-2xl font-black" style={{ color: accentColor }}>{p.priceFormatted}</p>
                  </div>
                </div>
                {/* Stats row — 2 columns on mobile */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { icon: Ruler, label: `${p.area} m²` },
                    { icon: BedDouble, label: `${p.bedrooms} Qtos` },
                    { icon: Bath, label: `${p.bathrooms} Banh.` },
                    { icon: Car, label: `${p.parking} Vagas` },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-2 rounded-lg border border-white/15">
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                      <p className="text-white font-bold text-xs">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a
                    href="#contato"
                    className="flex-1 text-center px-3 py-2.5 font-bold text-dark-950 text-xs shadow-xl hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, borderRadius: btnRadius }}
                  >
                    {ctaPrimary}
                  </a>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2.5 font-bold text-white text-xs bg-green-600 hover:bg-green-500"
                    style={{ borderRadius: btnRadius }}
                  >
                    WhatsApp
                  </a>
                </div>
                {/* Lead form on mobile — compact */}
                <div className="bg-white rounded-xl p-4 shadow-2xl">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Fale com o corretor</h3>
                  <p className="text-gray-500 text-xs mb-3">Receba mais informações.</p>
                  <div className="space-y-2">
                    <input className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-xs focus:outline-none placeholder-gray-400" placeholder="Nome completo" />
                    <input className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-xs focus:outline-none placeholder-gray-400" placeholder="WhatsApp" />
                    <input className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-xs focus:outline-none placeholder-gray-400" placeholder="E-mail" />
                    <button
                      className="w-full py-2.5 rounded-lg font-bold text-dark-950 text-xs shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
                    >
                      Quero mais informações
                    </button>
                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" /> Atendimento rápido e seguro
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Tablet/Desktop hero — 2 columns */
              <div className="max-w-6xl mx-auto">
                <div className={`grid gap-10 items-center ${isTablet ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-white text-sm font-medium mb-6 border border-white/20">
                      <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                      {p.neighborhood} · {p.city}, {p.state}
                    </div>
                    <h1 className={`${heroTitleSize} font-black text-white leading-tight mb-4`}>{p.title}</h1>
                    <p className="text-white/80 text-base mb-6 leading-relaxed max-w-lg">{p.description.substring(0, 150)}...</p>
                    <div className="mb-6">
                      <p className="text-white/60 text-sm mb-1">Valor</p>
                      <p className="text-4xl font-black" style={{ color: accentColor }}>{p.priceFormatted}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {[
                        { icon: Ruler, label: `${p.area} m²`, sub: 'Área privativa' },
                        { icon: BedDouble, label: `${p.bedrooms} Quartos`, sub: `${p.suites} suíte${p.suites !== 1 ? 's' : ''}` },
                        { icon: Bath, label: `${p.bathrooms} Banh.`, sub: '' },
                        { icon: Car, label: `${p.parking} Vagas`, sub: '' },
                      ].map(({ icon: Icon, label, sub }) => (
                        <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/15">
                          <Icon className="w-5 h-5" style={{ color: accentColor }} />
                          <div>
                            <p className="text-white font-bold text-sm">{label}</p>
                            {sub && <p className="text-white/60 text-xs">{sub}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <a
                        href="#contato"
                        className="px-8 py-4 font-bold text-dark-950 text-base shadow-xl hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, borderRadius: btnRadius }}
                      >
                        {ctaPrimary}
                      </a>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 font-bold text-white text-base bg-green-600 hover:bg-green-500"
                        style={{ borderRadius: btnRadius }}
                      >
                        {ctaSecondary}
                      </a>
                    </div>
                  </div>
                  {!isTablet && (
                    <div className="bg-white rounded-2xl p-7 shadow-2xl">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Fale com o corretor</h3>
                      <p className="text-gray-500 text-sm mb-6">Receba mais informações sobre este imóvel.</p>
                      <div className="space-y-3">
                        <input className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400" placeholder="Nome completo" />
                        <input className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400" placeholder="WhatsApp" />
                        <input className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400" placeholder="E-mail" />
                        <button
                          className="w-full py-4 rounded-xl font-bold text-dark-950 text-sm shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
                        >
                          Quero mais informações
                        </button>
                        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                          <Shield className="w-3 h-3" /> Atendimento rápido e seguro
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Tablet: show form below */}
                {isTablet && (
                  <div className="bg-white rounded-2xl p-6 shadow-2xl mt-8 max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Fale com o corretor</h3>
                    <div className="space-y-3">
                      <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400" placeholder="Nome completo" />
                      <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400" placeholder="WhatsApp" />
                      <button className="w-full py-3.5 rounded-xl font-bold text-dark-950 text-sm shadow-lg" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
                        Quero mais informações
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FEATURES */}
      {enabledSections.find((s: any) => s.type === 'features') && (
        <section className={`${isMobile ? 'py-6' : 'py-12'} bg-gray-50`}>
          <div className={`max-w-6xl mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
            <h2 className={`font-black text-gray-900 text-center mb-8 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Sobre o imóvel</h2>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-6'}`}>
              {[
                { icon: BedDouble, label: `${p.bedrooms} Quartos`, sub: `${p.suites} suíte${p.suites !== 1 ? 's' : ''}` },
                { icon: Bath, label: `${p.bathrooms} Banheiros`, sub: '' },
                { icon: Ruler, label: `${p.area} m²`, sub: 'Área privativa' },
                { icon: Car, label: `${p.parking} Vagas`, sub: 'de garagem' },
                ...(p.features.slice(0, isMobile ? 0 : 2).map((f: string) => ({ icon: CheckCircle, label: f, sub: '' }))),
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${primaryColor}15` }}>
                    <Icon className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <p className="font-bold text-gray-900 text-xs">{label}</p>
                  {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {enabledSections.find((s: any) => s.type === 'gallery') && p.images.length > 1 && (
        <section className={`${isMobile ? 'py-6' : 'py-12'} bg-white`}>
          <div className={`max-w-6xl mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
            <h2 className={`font-black text-gray-900 text-center mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Galeria de fotos</h2>
            <p className="text-gray-500 text-center mb-6 text-sm">Conheça cada detalhe deste imóvel</p>
            <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {p.images.slice(0, isMobile ? 4 : 8).map((img: string, i: number) => (
                <div
                  key={i}
                  className={`rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${
                    !isMobile && i === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                  style={{ aspectRatio: '4/3' }}
                >
                  <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRICE BOX */}
      {enabledSections.find((s: any) => s.type === 'price_box') && (
        <section className={`${isMobile ? 'py-6' : 'py-12'} bg-white`}>
          <div className={`max-w-4xl mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
            <h2 className={`font-black text-gray-900 text-center mb-8 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Valor do imóvel</h2>
            <div className="max-w-sm mx-auto bg-white border-2 rounded-3xl shadow-xl overflow-hidden" style={{ borderColor: `${primaryColor}30` }}>
              <div className="px-6 pt-7 pb-5 text-center" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${accentColor}08)` }}>
                <p className="text-gray-500 text-xs font-medium mb-2">Valor do imóvel</p>
                <p className={`font-black text-gray-900 leading-none ${isMobile ? 'text-3xl' : 'text-5xl'}`}>{p.priceFormatted}</p>
                <span className="inline-block mt-3 px-3 py-1 text-xs font-bold rounded-full text-white" style={{ background: primaryColor }}>
                  Ótimo preço
                </span>
              </div>
              {(p.condoFee || p.iptu) && (
                <div className="px-6 py-4 border-t border-gray-100 space-y-2.5">
                  {p.condoFee && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Condomínio</span>
                      <span className="font-bold text-gray-900">{p.condoFee}</span>
                    </div>
                  )}
                  {p.iptu && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">IPTU</span>
                      <span className="font-bold text-gray-900">{p.iptu}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="px-6 pb-6 pt-4 space-y-2.5">
                <a
                  href="#contato"
                  className="flex items-center justify-center gap-2 w-full py-3.5 font-bold text-white text-sm shadow-lg hover:opacity-90"
                  style={{ background: primaryColor, borderRadius: btnRadius }}
                >
                  {ctaPrimary}
                </a>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 font-semibold text-gray-700 text-sm bg-gray-100 hover:bg-gray-200"
                  style={{ borderRadius: btnRadius }}
                >
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
        <section className={`${isMobile ? 'py-6' : 'py-12'} bg-gray-50`}>
          <div className={`max-w-4xl mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
            <h2 className={`font-black text-gray-900 text-center mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Descrição completa</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">Tudo que você precisa saber sobre este imóvel</p>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-sm mb-6">{p.description}</p>
              {p.features.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Características</h4>
                  <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {p.features.map((f: string) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* AMENITIES */}
      {enabledSections.find((s: any) => s.type === 'amenities') && (
        ((p.availableItems && p.availableItems.length > 0) || (p.unavailableItems && p.unavailableItems.length > 0)) && (
          <section className={`${isMobile ? 'py-6' : 'py-12'} bg-white`}>
            <div className={`max-w-5xl mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
              <h2 className={`font-black text-gray-900 text-center mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Itens do imóvel</h2>
              <p className="text-gray-500 text-center mb-8 text-sm">Veja tudo que este imóvel oferece</p>
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {p.availableItems && p.availableItems.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-black flex-shrink-0">✓</span>
                      Itens disponíveis
                    </h3>
                    <div className="space-y-2">
                      {p.availableItems.filter((i: string) => i.trim()).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {p.unavailableItems && p.unavailableItems.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-400 mb-3 flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-black flex-shrink-0">✕</span>
                      Itens indisponíveis
                    </h3>
                    <div className="space-y-2">
                      {p.unavailableItems.filter((i: string) => i.trim()).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          <span className="line-through">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      )}

      {/* HIGHLIGHTS */}
      {enabledSections.find((s: any) => s.type === 'highlights') && p.highlights.length > 0 && (
        <section className={`${isMobile ? 'py-6' : 'py-12'} bg-white`}>
          <div className={`max-w-6xl mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
            <h2 className={`font-black text-gray-900 text-center mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Diferenciais</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">O que faz este imóvel ser especial</p>
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {p.highlights.map((h: string) => {
                const emoji = Object.entries(PROPERTY_ICONS).find(([k]) => h.toLowerCase().includes(k))?.[1] || '✨'
                return (
                  <div key={h} className="text-center p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                    <div className="text-3xl mb-2">{emoji}</div>
                    <p className="font-semibold text-gray-900 text-sm">{h}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA MID */}
      {enabledSections.find((s: any) => s.type === 'cta_mid') && (
        <section className="py-12" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}10)` }}>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Award className="w-10 h-10 mx-auto mb-3" style={{ color: primaryColor }} />
            <h2 className={`font-black text-gray-900 mb-3 ${isMobile ? 'text-xl' : 'text-3xl'}`}>Não perca esta oportunidade</h2>
            <p className="text-gray-600 text-sm mb-6">Entre em contato agora e agende uma visita sem compromisso.</p>
            <div className={`flex gap-3 justify-center ${isMobile ? 'flex-col' : 'flex-wrap'}`}>
              <a href="#contato" className="px-6 py-3.5 rounded-xl font-bold text-dark-950 text-sm hover:opacity-90 transition-all" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
                Agendar visita
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 transition-all text-sm">
                WhatsApp agora
              </a>
            </div>
          </div>
        </section>
      )}

      {/* LOCATION */}
      {enabledSections.find((s: any) => s.type === 'location') && (
        <section className={`${isMobile ? 'py-6' : 'py-12'} bg-white`}>
          <div className={`max-w-6xl mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
            <h2 className={`font-black text-gray-900 text-center mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Localização</h2>
            <p className="text-gray-500 text-center mb-8 text-sm flex items-center justify-center gap-1 flex-wrap">
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
              {p.address} — {p.city}, {p.state}
            </p>
            <div className="bg-gray-100 rounded-2xl overflow-hidden" style={{ height: isMobile ? '220px' : '280px' }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${p.address}, ${p.city}, ${p.state}, Brasil`)}&output=embed&z=15`}
                className="w-full h-full border-0 rounded-2xl"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* AGENT */}
      {enabledSections.find((s: any) => s.type === 'agent') && (
        <section className={`${isMobile ? 'py-6' : 'py-12'} bg-gray-50`}>
          <div className="max-w-xl mx-auto px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 overflow-hidden flex items-center justify-center" style={{ background: `${primaryColor}20` }}>
              <span className="text-2xl font-black" style={{ color: primaryColor }}>{p.agentName.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">{p.agentName}</h3>
            {p.agentCRECI && <p className="text-gray-500 text-sm mb-4">{p.agentCRECI}</p>}
            <div className={`flex gap-2 justify-center ${isMobile ? 'flex-col items-stretch' : 'flex-wrap'}`}>
              <a href={`tel:${p.phone}`} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:shadow-md transition-shadow">
                <Phone className="w-4 h-4 flex-shrink-0" /> {p.phone}
              </a>
              <a href={`mailto:${p.email}`} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:shadow-md transition-shadow">
                <Mail className="w-4 h-4 flex-shrink-0" /> E-mail
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-500 transition-colors">
                <Send className="w-4 h-4 flex-shrink-0" /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {enabledSections.find((s: any) => s.type === 'contact') && (
        <section id="contato" className={`${isMobile ? 'py-6' : 'py-12'} bg-white`}>
          <div className={`max-w-xl mx-auto ${isMobile ? 'px-3' : 'px-4'}`}>
            <h2 className={`font-black text-gray-900 text-center mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Entre em contato</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">Preencha o formulário e responderemos em até 2 horas</p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="space-y-3">
                <input className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400" placeholder="Nome completo" />
                <input className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400" placeholder="Telefone / WhatsApp" />
                <input className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400" placeholder="E-mail" />
                <textarea className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none placeholder-gray-400 resize-none" rows={3} placeholder="Mensagem (opcional)" defaultValue={`Tenho interesse no imóvel: ${p.title}`} />
                <button
                  className="w-full py-4 rounded-xl font-bold text-dark-950 text-sm shadow-lg hover:opacity-90 transition-all"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
                >
                  Quero conhecer este imóvel
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      {enabledSections.find((s: any) => s.type === 'footer') && (
        <footer className="py-8 bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className={`flex gap-4 mb-6 ${isMobile ? 'flex-col items-center text-center' : 'flex-row items-center justify-between'}`}>
              <div className={isMobile ? 'text-center' : 'text-left'}>
                <div className={`flex items-center gap-2 mb-2 ${isMobile ? 'justify-center' : ''}`}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: primaryColor }}>
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-white">{p.agencyName}</span>
                </div>
                {p.agentCRECI && <p className="text-gray-500 text-xs">{p.agentCRECI}</p>}
                <p className="text-gray-500 text-xs">{p.phone} · {p.email}</p>
              </div>
              <div className={`flex items-center gap-2 flex-wrap ${isMobile ? 'justify-center' : 'justify-end'}`}>
                {p.instagram && (
                  <a
                    href={`https://instagram.com/${(p.instagram || '').replace(/^@/, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-all text-xs font-medium"
                  >
                    <Instagram className="w-4 h-4 flex-shrink-0" />
                    {p.instagram}
                  </a>
                )}
                {p.tiktok && (
                  <a
                    href={`https://tiktok.com/${(p.tiktok || '').replace(/^@/, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-all text-xs font-medium"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
                    </svg>
                    {p.tiktok}
                  </a>
                )}
                {p.facebook && (
                  <a
                    href={`https://facebook.com/${p.facebook}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-all text-xs font-medium"
                  >
                    <Facebook className="w-4 h-4 flex-shrink-0" />
                    Facebook
                  </a>
                )}
                <a
                  href={waLink}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-green-700 rounded-xl text-white hover:bg-green-600 transition-all text-xs font-medium"
                >
                  <Send className="w-4 h-4 flex-shrink-0" />
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-5 text-center">
              <p className="text-gray-600 text-xs">
                © {new Date().getFullYear()} {p.agencyName}. Todos os direitos reservados.
              </p>
              <p className="text-gray-700 text-xs mt-1">
                Powered by <span style={{ color: primaryColor }}>Luz Smart Site</span>
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
