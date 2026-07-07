import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import type { PropertyData, ExtractionResult } from '@/types'
import { DEMO_PROPERTY } from '@/lib/mockData'

function clean(s: unknown): string {
  return String(s || '').replace(/\s+/g, ' ').trim()
}

function toNum(s: unknown): number {
  const n = parseFloat(String(s || '').replace(/[^\d,]/g, '').replace(',', '.'))
  return isNaN(n) ? 0 : n
}

function formatPrice(numeric: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(numeric)
}

function detectPortal(url: string): string {
  if (url.includes('zapimoveis')) return 'Zap Imóveis'
  if (url.includes('vivareal')) return 'Viva Real'
  if (url.includes('olx.com.br')) return 'OLX'
  if (url.includes('imovelweb')) return 'ImóvelWeb'
  if (url.includes('quintoandar')) return 'Quinto Andar'
  if (url.includes('mgfimoveis')) return 'MGF Imóveis'
  if (url.includes('loft.com.br')) return 'Loft'
  if (url.includes('chaves.com.br')) return 'Chaves na Mão'
  return 'Portal Imobiliário'
}

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
      },
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchHtmlViaProxy(url: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    const res = await fetch(proxyUrl, { signal: controller.signal })
    if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`)
    const data = await res.json() as { contents?: string }
    return data.contents || ''
  } finally {
    clearTimeout(timeout)
  }
}

// Filtra URLs que parecem ser fotos de imóveis (não logos, ícones, etc.)
function isPropertyImage(src: string): boolean {
  if (!src || !src.startsWith('http')) return false
  const lower = src.toLowerCase()
  // Exclui padrões de ícones, logos, UI
  const excluded = ['logo', 'icon', 'avatar', 'favicon', 'banner', 'badge', 'sprite', 'placeholder',
    'loading', 'spinner', 'blank', 'pixel', 'track', 'analytics', 'tag', 'fb.png', 'ga.', '.svg',
    'font', 'css', 'js', 'woff', '.gif']
  if (excluded.some((ex) => lower.includes(ex))) return false
  // Deve ter extensão de imagem ou ser URL de CDN de imóveis
  const imgExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
  const imgCdns = ['cdn', 'media', 'photo', 'image', 'img', 'foto', 'pictures', 'static',
    'res.cloudinary', 'amazonaws', 'akamai', 'fastly', 'imgix', 'unsplash']
  const hasExt = imgExts.some((ext) => lower.includes(ext))
  const hasCdn = imgCdns.some((cdn) => lower.includes(cdn))
  return hasExt || hasCdn
}

// ─── Quinto Andar ────────────────────────────────────────────────────────────
function scrapeQuintoAndar(html: string): Partial<PropertyData> {
  const $ = cheerio.load(html)
  const result: Partial<PropertyData> = {}

  try {
    const raw = $('#__NEXT_DATA__').text()
    if (!raw) return result
    const nextData = JSON.parse(raw)

    // Tenta vários caminhos de dados conhecidos do Quinto Andar
    const pageProps = nextData?.props?.pageProps
    const listing =
      pageProps?.listing ||
      pageProps?.property ||
      pageProps?.unit ||
      pageProps?.data?.listing ||
      pageProps?.initialState?.listing

    if (!listing) {
      // Tenta buscar no estado do Redux/Zustand serializado
      const stateStr = html.match(/"listing"\s*:\s*(\{[^}]+\})/)?.[1]
      if (stateStr) {
        try { Object.assign(listing || {}, JSON.parse(stateStr)) } catch { /* ignore */ }
      }
      return result
    }

    result.title = clean(listing.title || listing.description || listing.name)
    result.description = clean(listing.description || listing.longDescription || listing.body)

    // Preço
    const priceRaw =
      listing.price ||
      listing.rentPrice ||
      listing.salePrice ||
      listing.pricingInfos?.[0]?.price ||
      listing.financial?.price
    if (priceRaw) {
      const n = toNum(priceRaw)
      result.price = String(n)
      result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço'
    }

    // Área
    const areaRaw = listing.area || listing.usableArea || listing.totalArea ||
      listing.areas?.usable || listing.areas?.total
    if (areaRaw) result.area = String(Math.round(toNum(areaRaw)))

    // Quartos
    const bedroomsRaw = listing.bedrooms ?? listing.rooms ?? listing.numberOfRooms
    if (bedroomsRaw !== undefined) result.bedrooms = Number(bedroomsRaw)

    // Suítes
    if (listing.suites !== undefined) result.suites = Number(listing.suites)

    // Banheiros
    if (listing.bathrooms !== undefined) result.bathrooms = Number(listing.bathrooms)

    // Vagas
    const parkingRaw = listing.parkingSpaces ?? listing.garageSpaces ?? listing.parking
    if (parkingRaw !== undefined) result.parking = Number(parkingRaw)

    // Endereço
    const addr = listing.address || listing.location || {}
    result.city = clean(addr.city || addr.municipality || addr.cityName)
    result.state = clean(addr.state || addr.stateAcronym || addr.uf)
    result.neighborhood = clean(addr.neighborhood || addr.district || addr.neighbourhood)
    result.address = clean(addr.street || addr.streetName || addr.logradouro ||
      `${addr.streetName || ''} ${addr.streetNumber || ''}`.trim())
    result.zipCode = clean(addr.zipCode || addr.postalCode || addr.cep)

    // Imagens — vários formatos do Quinto Andar
    const rawImages =
      listing.images ||
      listing.photos ||
      listing.pictures ||
      listing.media ||
      listing.gallery || []

    const images: string[] = []
    for (const img of rawImages) {
      const src =
        img.originalUrl || img.url || img.src || img.urlOriginal ||
        img.largeUrl || img.mediumUrl ||
        (typeof img === 'string' ? img : null)
      if (src && isPropertyImage(src) && !images.includes(src) && images.length < 20) {
        images.push(src)
      }
    }

    // Também busca imagens em tags og e em srcset
    $('meta[property="og:image"]').each((_, el) => {
      const s = $(el).attr('content') || ''
      if (isPropertyImage(s) && !images.includes(s) && images.length < 20) images.push(s)
    })

    if (images.length > 0) result.images = images

    // Tipo do imóvel
    const typeRaw = listing.unitTypes?.[0] || listing.unitType || listing.propertyType || listing.type || ''
    const typeMap: Record<string, string> = {
      APARTMENT: 'Apartamento', HOUSE: 'Casa', STUDIO: 'Studio', KITNET: 'Kitnet',
      COMMERCIAL: 'Comercial', LAND: 'Terreno', PENTHOUSE: 'Cobertura',
      apartamento: 'Apartamento', casa: 'Casa', studio: 'Studio',
    }
    result.propertyType = typeMap[String(typeRaw).toUpperCase()] || typeMap[String(typeRaw).toLowerCase()] || 'Apartamento'

    // Features/diferenciais — separa disponíveis/indisponíveis
    const availableItems: string[] = []
    const unavailableItems: string[] = []
    const rawAmenities = listing.amenities || listing.features || listing.infrastructure || []
    for (const a of rawAmenities) {
      const label = typeof a === 'string' ? a : (a.name || a.label || a.description || '')
      const isAvailable = typeof a === 'object' ? (a.available !== false && a.active !== false && a.status !== 'unavailable' && a.status !== 'inactive') : true
      if (!label) continue
      if (isAvailable) availableItems.push(clean(label))
      else unavailableItems.push(clean(label))
    }
    if (availableItems.length > 0) {
      result.features = availableItems.slice(0, 15)
      result.availableItems = availableItems.slice(0, 20)
    }
    if (unavailableItems.length > 0) result.unavailableItems = unavailableItems.slice(0, 15)

  } catch (e) {
    console.warn('Quinto Andar parse error:', e)
  }

  return result
}

// ─── Zap / Viva Real (NEXT_DATA) ─────────────────────────────────────────────
function scrapeZapVivaReal(html: string): Partial<PropertyData> {
  const $ = cheerio.load(html)
  const result: Partial<PropertyData> = {}

  try {
    const raw = $('#__NEXT_DATA__').text()
    if (!raw) return result
    const nextData = JSON.parse(raw)

    const pageProps = nextData?.props?.pageProps
    const listing =
      pageProps?.listing?.listing ||
      pageProps?.listingProps?.listing ||
      pageProps?.initialProps?.listing

    if (!listing) return result

    result.title = clean(listing.title)
    result.description = clean(listing.description)

    // Preço
    const priceInfo = listing.pricingInfos?.[0]
    if (priceInfo) {
      const n = toNum(priceInfo.price || priceInfo.yearlyIptu || 0)
      result.price = String(n)
      result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço'
    }

    // Dimensões
    const area = listing.usableAreas?.[0] || listing.totalAreas?.[0]
    if (area) result.area = String(Math.round(toNum(area)))
    if (listing.bedrooms?.[0] !== undefined) result.bedrooms = Number(listing.bedrooms[0])
    if (listing.suites?.[0] !== undefined) result.suites = Number(listing.suites[0])
    if (listing.bathrooms?.[0] !== undefined) result.bathrooms = Number(listing.bathrooms[0])
    if (listing.parkingSpaces?.[0] !== undefined) result.parking = Number(listing.parkingSpaces[0])

    // Endereço
    const addr = listing.address || {}
    result.city = clean(addr.city)
    result.state = clean(addr.stateAcronym || addr.state)
    result.neighborhood = clean(addr.neighborhood)
    result.address = clean([addr.street, addr.streetNumber].filter(Boolean).join(', '))
    result.zipCode = clean(addr.zipCode)
    if (addr.point) {
      result.latitude = addr.point.lat
      result.longitude = addr.point.lon
    }

    // Imagens
    const images: string[] = []
    for (const img of listing.images || []) {
      const src = img.originalUrl || img.url || img.src || ''
      if (isPropertyImage(src) && !images.includes(src) && images.length < 20) images.push(src)
    }

    // og:image como fallback
    $('meta[property="og:image"]').each((_, el) => {
      const s = $(el).attr('content') || ''
      if (isPropertyImage(s) && !images.includes(s) && images.length < 20) images.push(s)
    })

    if (images.length > 0) result.images = images

    // Tipo
    const unitType = listing.unitTypes?.[0] || listing.unitType || ''
    const typeMap: Record<string, string> = { APARTMENT: 'Apartamento', HOUSE: 'Casa', LAND: 'Terreno', COMMERCIAL: 'Comercial' }
    result.propertyType = typeMap[unitType] || 'Apartamento'

    // Amenidades
    const amenities = (listing.amenities || []).map((a: unknown) =>
      typeof a === 'string' ? a : (a as Record<string, unknown>)?.name || ''
    ).filter(Boolean).slice(0, 15)
    if (amenities.length > 0) result.features = amenities

  } catch (e) {
    console.warn('Zap/VivaReal parse error:', e)
  }

  return result
}

// ─── OLX ─────────────────────────────────────────────────────────────────────
function scrapeOlx(html: string): Partial<PropertyData> {
  const $ = cheerio.load(html)
  const result: Partial<PropertyData> = {}

  try {
    $('script[type="application/json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).text())
        const ad = data?.ad || data?.initialState?.ad
        if (!ad) return

        result.title = clean(ad.title || ad.subject)
        result.description = clean(ad.body || ad.description)

        const price = toNum(ad.priceValue || ad.price?.value || 0)
        result.price = String(price)
        result.priceFormatted = price > 0 ? formatPrice(price) : 'Consulte o preço'

        const props: Record<string, string> = {}
        ;(ad.properties || []).forEach((p: { name?: unknown; value?: unknown; values?: unknown[] }) => {
          props[String(p.name)] = String(p.value ?? (p.values && p.values[0]) ?? '')
        })
        result.bedrooms = toNum(props['rooms'] || props['bedrooms'] || '0') || 0
        result.bathrooms = toNum(props['bathrooms'] || '1') || 1
        result.area = String(toNum(props['size'] || '0'))
        result.parking = toNum(props['garage_spots'] || '0')

        result.city = clean(ad.location?.municipality || ad.location?.city)
        result.state = clean(ad.location?.uf || ad.location?.state)
        result.neighborhood = clean(ad.location?.neighbourhood || ad.location?.neighborhood)

        const images: string[] = []
        for (const img of ad.images || []) {
          const src = img.original || img.large || img.url || img.src || ''
          if (isPropertyImage(src) && !images.includes(src) && images.length < 20) images.push(src)
        }
        if (images.length > 0) result.images = images

      } catch { /* ignore */ }
    })
  } catch (e) {
    console.warn('OLX parse error:', e)
  }

  return result
}

// ─── Scraper genérico (qualquer portal) ──────────────────────────────────────
function scrapeGeneric(html: string, url: string): Partial<PropertyData> {
  const $ = cheerio.load(html)
  const result: Partial<PropertyData> = {}

  // JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const items = [JSON.parse($(el).text())].flat()
      for (const item of items) {
        if (!item?.name && !item?.description) continue
        if (!result.title) result.title = clean(item.name)
        if (!result.description) result.description = clean(item.description)
        if (item.offers?.price) {
          const n = toNum(item.offers.price)
          result.price = String(n)
          result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço'
        }
        if (item.address) {
          result.city = clean(item.address.addressLocality)
          result.state = clean(item.address.addressRegion)
          result.neighborhood = clean(item.address.neighborhood)
          result.address = clean(item.address.streetAddress)
        }
        break
      }
    } catch { /* ignore */ }
  })

  // Título por fallback
  if (!result.title) {
    result.title = clean(
      $('h1').first().text() ||
      $('meta[property="og:title"]').attr('content') ||
      $('title').text()
    ).substring(0, 120)
  }

  // Descrição por fallback
  if (!result.description) {
    result.description = clean(
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('[class*="description"]').first().text() ||
      $('[class*="descricao"]').first().text()
    ).substring(0, 1000)
  }

  const pageText = $('body').text()

  // Preço
  if (!result.priceFormatted) {
    const priceMatch = pageText.match(/R\$\s*[\d.,]+/)
    if (priceMatch) {
      const n = toNum(priceMatch[0])
      result.price = String(n)
      result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço'
    }
  }

  // Área
  if (!result.area) {
    const m = pageText.match(/(\d+[\d.,]*)\s*m[²2]/i)
    if (m) result.area = String(Math.round(toNum(m[1])))
  }

  // Quartos (inclui studio/0)
  if (result.bedrooms === undefined) {
    const m = pageText.match(/(\d+)\s*(?:quarto|dormit)/i)
    result.bedrooms = m ? parseInt(m[1]) : 0
  }

  // Suítes
  if (!result.suites) {
    const m = pageText.match(/(\d+)\s*su[íi]te/i)
    result.suites = m ? parseInt(m[1]) : 0
  }

  // Banheiros
  if (!result.bathrooms) {
    const m = pageText.match(/(\d+)\s*banheiro/i)
    result.bathrooms = m ? parseInt(m[1]) : 1
  }

  // Vagas
  if (!result.parking) {
    const m = pageText.match(/(\d+)\s*vaga/i)
    result.parking = m ? parseInt(m[1]) : 0
  }

  // Localização
  if (!result.city) {
    const m = pageText.match(/([A-Za-zÀ-ÿ\s]{3,40})\s*[-–,]\s*([A-Z]{2})\b/)
    if (m) { result.city = clean(m[1]); result.state = m[2] }
  }

  // Tipo de imóvel
  const t = (result.title || '').toLowerCase()
  if (t.includes('studio') || t.includes('kitnet') || (result.bedrooms === 0)) result.propertyType = 'Studio'
  else if (t.includes('casa') || t.includes('sobrado') || t.includes('townhouse')) result.propertyType = 'Casa'
  else if (t.includes('cobertura') || t.includes('penthouse')) result.propertyType = 'Cobertura'
  else if (t.includes('terreno') || t.includes('lote')) result.propertyType = 'Terreno'
  else if (t.includes('comercial') || t.includes('sala') || t.includes('loja')) result.propertyType = 'Comercial'
  else result.propertyType = 'Apartamento'

  result.agencyName = detectPortal(url)

  // Imagens — estratégia agressiva para pegar fotos do imóvel
  const images: string[] = []
  const ogImg = $('meta[property="og:image"]').attr('content')
  if (ogImg && isPropertyImage(ogImg)) images.push(ogImg)

  // Pega imagens de tags <img> que pareçam fotos de imóveis
  $('img[src], img[data-src], img[data-lazy-src], img[data-original]').each((_, el) => {
    const src =
      $(el).attr('src') ||
      $(el).attr('data-src') ||
      $(el).attr('data-lazy-src') ||
      $(el).attr('data-original') || ''
    if (isPropertyImage(src) && !images.includes(src) && images.length < 20) {
      images.push(src)
    }
  })

  // srcset
  $('[srcset]').each((_, el) => {
    const srcset = $(el).attr('srcset') || ''
    const parts = srcset.split(',').map((s) => s.trim().split(/\s+/)[0])
    for (const src of parts) {
      if (isPropertyImage(src) && !images.includes(src) && images.length < 20) images.push(src)
    }
  })

  if (images.length > 0) result.images = images

  return result
}

function parseHtml(html: string, url: string): Partial<PropertyData> {
  if (url.includes('quintoandar')) return scrapeQuintoAndar(html)
  if (url.includes('zapimoveis') || url.includes('vivareal')) return scrapeZapVivaReal(html)
  if (url.includes('olx.com.br')) return scrapeOlx(html)
  return scrapeGeneric(html, url)
}

function isGoodExtraction(scraped: Partial<PropertyData>): boolean {
  return !!(scraped.title && scraped.priceFormatted && scraped.priceFormatted !== 'Consulte o preço')
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ success: false, error: 'URL inválida' }, { status: 400 })
    }

    let scraped: Partial<PropertyData> = {}
    let partial = true

    // 1ª tentativa: fetch direto
    try {
      const html = await fetchHtml(url)
      scraped = parseHtml(html, url)
      if (isGoodExtraction(scraped)) partial = false
    } catch (e) {
      console.warn('Direct fetch failed:', e)
    }

    // 2ª tentativa: proxy CORS (contorna bloqueio de IP de portais)
    if (partial) {
      try {
        const html = await fetchHtmlViaProxy(url)
        if (html.length > 1000) {
          const proxied = parseHtml(html, url)
          // Merge: mantém o que já foi extraído + complementa com o proxy
          scraped = { ...scraped, ...proxied }
          if (isGoodExtraction(scraped)) partial = false
        }
      } catch (e) {
        console.warn('Proxy fetch failed:', e)
      }
    }

    // Remove campos vazios / zero do scraped
    const cleanedScraped = Object.fromEntries(
      Object.entries(scraped).filter(([, v]) => {
        if (v === undefined || v === null || v === '') return false
        if (Array.isArray(v) && v.length === 0) return false
        return true
      })
    )
    if (scraped.bedrooms === 0) cleanedScraped.bedrooms = 0

    // Campos de contato do DEMO (nunca aparecem em portais, o corretor precisa preencher)
    const contactDefaults = {
      phone: DEMO_PROPERTY.phone,
      whatsapp: DEMO_PROPERTY.whatsapp,
      email: DEMO_PROPERTY.email,
      agentName: DEMO_PROPERTY.agentName,
      agencyName: String(cleanedScraped.agencyName || detectPortal(url)),
      agentCRECI: DEMO_PROPERTY.agentCRECI,
    }

    // Campos do imóvel: usa dados reais se extraídos, senão placeholder vazio (não usa DEMO)
    const propertyDefaults: Partial<PropertyData> = partial ? {
      title: cleanedScraped.title || '',
      description: cleanedScraped.description || '',
      price: cleanedScraped.price || '',
      priceFormatted: cleanedScraped.priceFormatted || 'Consulte o preço',
      area: cleanedScraped.area || '0',
      bedrooms: cleanedScraped.bedrooms ?? 0,
      suites: cleanedScraped.suites ?? 0,
      bathrooms: cleanedScraped.bathrooms ?? 1,
      parking: cleanedScraped.parking ?? 0,
      city: cleanedScraped.city || '',
      state: cleanedScraped.state || '',
      neighborhood: cleanedScraped.neighborhood || '',
      address: cleanedScraped.address || '',
      zipCode: cleanedScraped.zipCode || '',
      images: (Array.isArray(cleanedScraped.images) && cleanedScraped.images.length > 0) ? cleanedScraped.images as string[] : DEMO_PROPERTY.images,
      features: cleanedScraped.features || [],
      highlights: cleanedScraped.highlights || DEMO_PROPERTY.highlights,
      propertyType: cleanedScraped.propertyType || 'Apartamento',
    } : cleanedScraped

    const extracted: PropertyData = {
      ...DEMO_PROPERTY,
      ...propertyDefaults,
      ...contactDefaults,
      ...cleanedScraped,
      sourceUrl: url,
      extractedAt: new Date().toISOString(),
    }

    if (!extracted.priceFormatted && extracted.price) {
      const n = toNum(extracted.price)
      if (n > 0) extracted.priceFormatted = formatPrice(n)
    }

    if (!extracted.listingType) {
      const urlLower = url.toLowerCase()
      extracted.listingType = urlLower.includes('aluguel') || urlLower.includes('locar') ? 'aluguel' : 'venda'
    }

    return NextResponse.json({ success: true, data: extracted, partial } as ExtractionResult)

  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar o link. Verifique se o link é válido.' },
      { status: 500 }
    )
  }
}
