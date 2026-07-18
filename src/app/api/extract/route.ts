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
  if (url.includes('zapimoveis'))   return 'Zap Imóveis'
  if (url.includes('vivareal'))     return 'Viva Real'
  if (url.includes('olx.com.br'))   return 'OLX'
  if (url.includes('imovelweb'))    return 'ImóvelWeb'
  if (url.includes('quintoandar'))  return 'Quinto Andar'
  if (url.includes('mgfimoveis'))   return 'MGF Imóveis'
  if (url.includes('loft.com.br'))  return 'Loft'
  if (url.includes('chaves.com.br'))return 'Chaves na Mão'
  if (url.includes('123i.com.br'))  return '123i'
  if (url.includes('netimóveis') || url.includes('netimoveis')) return 'Net Imóveis'
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

async function fetchHtmlViaProxy(url: string, proxyBase: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    let proxyUrl: string
    if (proxyBase === 'allorigins') {
      proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      const res = await fetch(proxyUrl, { signal: controller.signal })
      if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`)
      const data = await res.json() as { contents?: string }
      return data.contents || ''
    } else {
      proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
      const res = await fetch(proxyUrl, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) throw new Error(`Proxy2 HTTP ${res.status}`)
      return await res.text()
    }
  } finally {
    clearTimeout(timeout)
  }
}

function isPropertyImage(src: string): boolean {
  if (!src || !src.startsWith('http')) return false
  const lower = src.toLowerCase()
  const excluded = ['logo', 'icon', 'avatar', 'favicon', 'banner', 'badge', 'sprite', 'placeholder',
    'loading', 'spinner', 'blank', 'pixel', 'track', 'analytics', 'tag', 'fb.png', 'ga.',
    '.svg', 'font', 'css', '.js', 'woff', '.gif', 'map-', 'street-view', 'pin.', 'marker']
  if (excluded.some((ex) => lower.includes(ex))) return false
  const imgExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
  const imgCdns = ['cdn', 'media', 'photo', 'image', 'img', 'foto', 'pictures', 'static',
    'res.cloudinary', 'amazonaws', 'akamai', 'fastly', 'imgix', 'unsplash', 'imobi', 'imobil']
  const hasExt = imgExts.some((ext) => lower.includes(ext))
  const hasCdn = imgCdns.some((cdn) => lower.includes(cdn))
  return hasExt || hasCdn
}

// ─── Utilitário: extrair listing de __NEXT_DATA__ tentando vários caminhos ────
function extractListingFromNextData(html: string): Record<string, unknown> | null {
  try {
    const raw = /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i.exec(html)?.[1]
    if (!raw) return null
    const nextData = JSON.parse(raw)

    // Tenta todos os caminhos possíveis do Next.js
    const pp = nextData?.props?.pageProps
    const candidates = [
      pp?.listing?.listing,
      pp?.listingProps?.listing,
      pp?.initialProps?.listing,
      pp?.listing,
      pp?.property,
      pp?.unit,
      pp?.data?.listing,
      pp?.data?.property,
      pp?.initialState?.listing,
      pp?.serverData?.listing,
      pp?.serverData?.property,
      nextData?.query?.listing,
    ]
    for (const c of candidates) {
      if (c && typeof c === 'object' && Object.keys(c).length > 3) return c as Record<string, unknown>
    }

    // Busca recursiva: procura qualquer objeto com campo "title" e "price" ou "bedrooms"
    function findListing(obj: unknown, depth = 0): Record<string, unknown> | null {
      if (depth > 6 || !obj || typeof obj !== 'object') return null
      const o = obj as Record<string, unknown>
      if ((o.title || o.description) && (o.price || o.bedrooms !== undefined || o.pricingInfos)) return o
      for (const val of Object.values(o)) {
        const found = findListing(val, depth + 1)
        if (found) return found
      }
      return null
    }
    return findListing(nextData)
  } catch { return null }
}

// ─── Quinto Andar ────────────────────────────────────────────────────────────
function scrapeQuintoAndar(html: string): Partial<PropertyData> {
  const $ = cheerio.load(html)
  const result: Partial<PropertyData> = {}

  try {
    const listing = extractListingFromNextData(html)
    if (!listing) return result

    result.title = clean(listing.title || listing.description || listing.name)
    result.description = clean(listing.description || listing.longDescription || listing.body)

    const priceRaw = listing.price || listing.rentPrice || listing.salePrice ||
      (listing.pricingInfos as any)?.[0]?.price || (listing.financial as any)?.price
    if (priceRaw) {
      const n = toNum(priceRaw)
      result.price = String(n)
      result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço'
    }

    const areaRaw = listing.area || listing.usableArea || listing.totalArea ||
      (listing.areas as any)?.usable || (listing.areas as any)?.total
    if (areaRaw) result.area = String(Math.round(toNum(areaRaw)))

    result.bedrooms = Number(listing.bedrooms ?? listing.rooms ?? listing.numberOfRooms ?? 0)
    if (listing.suites  !== undefined) result.suites  = Number(listing.suites)
    if (listing.bathrooms !== undefined) result.bathrooms = Number(listing.bathrooms)
    result.parking = Number(listing.parkingSpaces ?? listing.garageSpaces ?? listing.parking ?? 0)

    const addr = (listing.address || listing.location || {}) as Record<string, unknown>
    result.city         = clean(addr.city || addr.municipality || addr.cityName)
    result.state        = clean(addr.state || addr.stateAcronym || addr.uf)
    result.neighborhood = clean(addr.neighborhood || addr.district || addr.neighbourhood)
    result.address      = clean(addr.street || addr.streetName || addr.logradouro ||
      `${addr.streetName || ''} ${addr.streetNumber || ''}`.trim())
    result.zipCode      = clean(addr.zipCode || addr.postalCode || addr.cep)

    const rawImages: unknown[] = (listing.images || listing.photos || listing.pictures || listing.media || listing.gallery || []) as unknown[]
    const images: string[] = []
    for (const img of rawImages) {
      const src = (img as any).originalUrl || (img as any).url || (img as any).src ||
        (img as any).largeUrl || (img as any).mediumUrl || (typeof img === 'string' ? img : null)
      if (src && isPropertyImage(src) && !images.includes(src) && images.length < 20) images.push(src)
    }
    $('meta[property="og:image"]').each((_, el) => {
      const s = $(el).attr('content') || ''
      if (isPropertyImage(s) && !images.includes(s) && images.length < 20) images.push(s)
    })
    if (images.length > 0) result.images = images

    const typeRaw = String((listing.unitTypes as any)?.[0] || listing.unitType || listing.propertyType || listing.type || '')
    const typeMap: Record<string, string> = {
      APARTMENT: 'Apartamento', HOUSE: 'Casa', STUDIO: 'Studio', KITNET: 'Kitnet',
      COMMERCIAL: 'Comercial', LAND: 'Terreno', PENTHOUSE: 'Cobertura',
    }
    result.propertyType = typeMap[typeRaw.toUpperCase()] || 'Apartamento'

    const availableItems: string[] = []
    const unavailableItems: string[] = []
    const rawAmenities = (listing.amenities || listing.features || listing.infrastructure || []) as unknown[]
    for (const a of rawAmenities) {
      const label = typeof a === 'string' ? a : ((a as any).name || (a as any).label || (a as any).description || '')
      const ok = typeof a === 'object' ? ((a as any).available !== false && (a as any).status !== 'unavailable') : true
      if (!label) continue
      if (ok) availableItems.push(clean(label))
      else unavailableItems.push(clean(label))
    }
    if (availableItems.length > 0) { result.features = availableItems.slice(0, 15); result.availableItems = availableItems.slice(0, 20) }
    if (unavailableItems.length > 0) result.unavailableItems = unavailableItems.slice(0, 15)
  } catch (e) { console.warn('QuintoAndar parse error:', e) }

  return result
}

// ─── Zap / Viva Real ─────────────────────────────────────────────────────────
function scrapeZapVivaReal(html: string): Partial<PropertyData> {
  const $ = cheerio.load(html)
  const result: Partial<PropertyData> = {}

  try {
    const listing = extractListingFromNextData(html)
    if (!listing) return result

    result.title       = clean(listing.title)
    result.description = clean(listing.description)

    // Preço — tenta várias estruturas
    const priceInfo = (listing.pricingInfos as any)?.[0]
    const priceRaw  = priceInfo?.price || listing.price || listing.salePrice || listing.rentPrice || 0
    const condoFeeRaw = priceInfo?.monthlyCondoFee || listing.condoFee
    const iptuRaw     = priceInfo?.yearlyIptu || listing.iptu
    if (priceRaw) {
      const n = toNum(priceRaw)
      result.price         = String(n)
      result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço'
    }
    if (condoFeeRaw) result.condoFee = `R$ ${toNum(condoFeeRaw).toLocaleString('pt-BR')}/mês`
    if (iptuRaw)     result.iptu     = `R$ ${toNum(iptuRaw).toLocaleString('pt-BR')}/ano`

    // Dimensões
    const areaArr = listing.usableAreas || listing.totalAreas
    result.area     = String(Math.round(toNum(Array.isArray(areaArr) ? areaArr[0] : areaArr || 0)))
    result.bedrooms = Number(Array.isArray(listing.bedrooms) ? listing.bedrooms[0] : listing.bedrooms ?? 0)
    result.suites   = Number(Array.isArray(listing.suites)   ? listing.suites[0]   : listing.suites   ?? 0)
    result.bathrooms= Number(Array.isArray(listing.bathrooms)? listing.bathrooms[0]: listing.bathrooms ?? 1)
    result.parking  = Number(Array.isArray(listing.parkingSpaces) ? listing.parkingSpaces[0] : listing.parkingSpaces ?? 0)
    if (listing.floors) result.floor = String((listing.floors as any)[0] || '')
    if (listing.totalFloors) result.totalFloors = String(listing.totalFloors)

    // Endereço
    const addr = (listing.address || {}) as Record<string, unknown>
    result.city         = clean(addr.city)
    result.state        = clean(addr.stateAcronym || addr.state)
    result.neighborhood = clean(addr.neighborhood)
    result.address      = clean([addr.street, addr.streetNumber].filter(Boolean).join(', '))
    result.zipCode      = clean(addr.zipCode)
    if ((addr.point as any)?.lat) { result.latitude = (addr.point as any).lat; result.longitude = (addr.point as any).lon }

    // Imagens
    const images: string[] = []
    for (const img of (listing.images || []) as any[]) {
      const src = img.originalUrl || img.url || img.src || ''
      if (isPropertyImage(src) && !images.includes(src) && images.length < 20) images.push(src)
    }
    $('meta[property="og:image"]').each((_, el) => {
      const s = $(el).attr('content') || ''
      if (isPropertyImage(s) && !images.includes(s) && images.length < 20) images.push(s)
    })
    if (images.length > 0) result.images = images

    // Tipo
    const unitType = String((listing.unitTypes as any)?.[0] || listing.unitType || '')
    const typeMap: Record<string, string> = {
      APARTMENT: 'Apartamento', HOUSE: 'Casa', LAND: 'Terreno', COMMERCIAL: 'Comercial',
      STUDIO: 'Studio', KITNET: 'Kitnet', PENTHOUSE: 'Cobertura',
    }
    result.propertyType = typeMap[unitType] || 'Apartamento'

    // Amenidades
    const amenities = ((listing.amenities || listing.features || []) as any[])
      .map((a: any) => typeof a === 'string' ? a : a?.name || a?.label || '')
      .filter(Boolean).slice(0, 20)
    if (amenities.length > 0) { result.features = amenities; result.availableItems = amenities }

    // Tags / highlights
    const tags = ((listing.tags || listing.highlights || listing.differentials || []) as any[])
      .map((t: any) => typeof t === 'string' ? t : t?.label || t?.name || '')
      .filter(Boolean).slice(0, 10)
    if (tags.length > 0) result.highlights = tags

  } catch (e) { console.warn('Zap/VivaReal parse error:', e) }

  return result
}

// ─── OLX ─────────────────────────────────────────────────────────────────────
function scrapeOlx(html: string): Partial<PropertyData> {
  const result: Partial<PropertyData> = {}
  try {
    const $ = cheerio.load(html)
    $('script[type="application/json"], script[type="text/javascript"]').each((_, el) => {
      try {
        const text = $(el).text()
        if (!text.includes('"title"') && !text.includes('"subject"')) return
        const data = JSON.parse(text)
        const ad = data?.ad || data?.initialState?.ad || data?.props?.pageProps?.ad
        if (!ad) return

        result.title       = clean(ad.title || ad.subject)
        result.description = clean(ad.body  || ad.description)

        const price = toNum(ad.priceValue || ad.price?.value || 0)
        result.price         = String(price)
        result.priceFormatted = price > 0 ? formatPrice(price) : 'Consulte o preço'

        const props: Record<string, string> = {}
        ;(ad.properties || []).forEach((p: any) => {
          props[String(p.name)] = String(p.value ?? (p.values && p.values[0]) ?? '')
        })
        result.bedrooms  = toNum(props['rooms']         || props['bedrooms']   || '0') || 0
        result.bathrooms = toNum(props['bathrooms']      || '1') || 1
        result.area      = String(toNum(props['size']    || '0'))
        result.parking   = toNum(props['garage_spots']  || '0')

        result.city         = clean(ad.location?.municipality || ad.location?.city)
        result.state        = clean(ad.location?.uf           || ad.location?.state)
        result.neighborhood = clean(ad.location?.neighbourhood || ad.location?.neighborhood)
        result.address      = clean(ad.location?.address      || ad.location?.street || '')
        result.zipCode      = clean(ad.location?.zipcode      || '')

        const images: string[] = []
        for (const img of ad.images || []) {
          const src = img.original || img.large || img.url || img.src || ''
          if (isPropertyImage(src) && !images.includes(src) && images.length < 20) images.push(src)
        }
        if (images.length > 0) result.images = images
      } catch { /* ignore */ }
    })
  } catch (e) { console.warn('OLX parse error:', e) }
  return result
}

// ─── Scraper genérico melhorado ───────────────────────────────────────────────
function scrapeGeneric(html: string, url: string): Partial<PropertyData> {
  const $ = cheerio.load(html)
  const result: Partial<PropertyData> = {}

  // 1. Tenta __NEXT_DATA__ genérico
  const listing = extractListingFromNextData(html)
  if (listing) {
    if (listing.title)       result.title       = clean(listing.title)
    if (listing.description) result.description = clean(listing.description)
    const priceRaw = (listing.pricingInfos as any)?.[0]?.price || listing.price || listing.salePrice || listing.rentPrice
    if (priceRaw) { const n = toNum(priceRaw); result.price = String(n); result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço' }
    const addr = (listing.address || {}) as any
    if (addr.city) result.city = clean(addr.city)
    if (addr.state || addr.stateAcronym) result.state = clean(addr.stateAcronym || addr.state)
    if (addr.neighborhood) result.neighborhood = clean(addr.neighborhood)
    const areaRaw = listing.usableArea || listing.area || (listing.usableAreas as any)?.[0]
    if (areaRaw) result.area = String(Math.round(toNum(areaRaw)))
    if (listing.bedrooms !== undefined) result.bedrooms = Number((listing.bedrooms as any)?.[0] ?? listing.bedrooms)
    if (listing.bathrooms !== undefined) result.bathrooms = Number((listing.bathrooms as any)?.[0] ?? listing.bathrooms)
    if (listing.parkingSpaces !== undefined) result.parking = Number((listing.parkingSpaces as any)?.[0] ?? listing.parkingSpaces)
    const imgs: string[] = []
    for (const img of ((listing.images || listing.photos || []) as any[])) {
      const src = img.originalUrl || img.url || img.src || (typeof img === 'string' ? img : '')
      if (isPropertyImage(src) && !imgs.includes(src) && imgs.length < 20) imgs.push(src)
    }
    if (imgs.length > 0) result.images = imgs
  }

  // 2. JSON-LD (Schema.org)
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const items = [JSON.parse($(el).text())].flat()
      for (const item of items) {
        if (!item?.name && !item?.description) continue
        if (!result.title)       result.title       = clean(item.name)
        if (!result.description) result.description = clean(item.description)
        if (item.offers?.price && !result.price) {
          const n = toNum(item.offers.price)
          result.price = String(n); result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço'
        }
        if (item.address) {
          if (!result.city)         result.city         = clean(item.address.addressLocality)
          if (!result.state)        result.state        = clean(item.address.addressRegion)
          if (!result.neighborhood) result.neighborhood = clean(item.address.neighborhood)
          if (!result.address)      result.address      = clean(item.address.streetAddress)
          if (!result.zipCode)      result.zipCode      = clean(item.address.postalCode)
        }
        if (item.numberOfRooms && result.bedrooms === undefined) result.bedrooms = Number(item.numberOfRooms)
        if (item.floorSize?.value && !result.area) result.area = String(Math.round(toNum(item.floorSize.value)))
        if (item.image && !result.images) {
          const imgArr = Array.isArray(item.image) ? item.image : [item.image]
          const imgs = imgArr.map((i: any) => typeof i === 'string' ? i : i?.url || '').filter(isPropertyImage)
          if (imgs.length > 0) result.images = imgs
        }
        break
      }
    } catch { /* ignore */ }
  })

  // 3. Meta tags og
  if (!result.title)       result.title       = clean($('h1').first().text() || $('meta[property="og:title"]').attr('content') || $('title').text()).substring(0, 120)
  if (!result.description) result.description = clean($('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || $('[class*="descri"]').first().text()).substring(0, 1000)

  const pageText = $('body').text()

  // 4. Regex no texto da página
  if (!result.priceFormatted) {
    const priceMatch = pageText.match(/R\$\s*[\d.,]+/)
    if (priceMatch) { const n = toNum(priceMatch[0]); result.price = String(n); result.priceFormatted = n > 0 ? formatPrice(n) : 'Consulte o preço' }
  }
  if (!result.area) {
    const m = pageText.match(/(\d[\d.,]*)\s*m[²2]/i)
    if (m) result.area = String(Math.round(toNum(m[1])))
  }
  if (result.bedrooms === undefined) {
    const m = pageText.match(/(\d+)\s*(?:quarto|dormit|suite)/i)
    result.bedrooms = m ? parseInt(m[1]) : 0
  }
  if (!result.suites) {
    const m = pageText.match(/(\d+)\s*su[íi]te/i)
    result.suites = m ? parseInt(m[1]) : 0
  }
  if (!result.bathrooms) {
    const m = pageText.match(/(\d+)\s*banheiro/i)
    result.bathrooms = m ? parseInt(m[1]) : 1
  }
  if (!result.parking) {
    const m = pageText.match(/(\d+)\s*vaga/i)
    result.parking = m ? parseInt(m[1]) : 0
  }
  if (!result.city) {
    const m = pageText.match(/([A-Za-zÀ-ÿ\s]{3,40})\s*[-–,]\s*([A-Z]{2})\b/)
    if (m) { result.city = clean(m[1]); result.state = m[2] }
  }

  // 5. Amenidades/features por texto
  if (!result.features || result.features.length === 0) {
    const amenityKeywords = ['piscina','churrasqueira','academia','varanda','sacada','garagem','elevador',
      'salão de festas','playground','quadra','sauna','jardim','portaria','segurança','pet','gourmet',
      'coworking','spa','heliponto','automação','energia solar','câmeras','interfone','gerador']
    const found = amenityKeywords.filter(kw => pageText.toLowerCase().includes(kw))
    if (found.length > 0) result.features = found.map(f => f.charAt(0).toUpperCase() + f.slice(1))
  }

  // 6. Tipo do imóvel
  if (!result.propertyType) {
    const t = (result.title || pageText.substring(0, 500)).toLowerCase()
    if (t.includes('studio') || t.includes('kitnet')) result.propertyType = 'Studio'
    else if (t.includes('cobertura') || t.includes('penthouse')) result.propertyType = 'Cobertura'
    else if (t.includes('terreno') || t.includes('lote')) result.propertyType = 'Terreno'
    else if (t.includes('comercial') || t.includes('sala') || t.includes('loja')) result.propertyType = 'Comercial'
    else if (t.includes('casa') || t.includes('sobrado') || t.includes('townhouse')) result.propertyType = 'Casa'
    else result.propertyType = 'Apartamento'
  }

  // 7. Imagens — estratégia agressiva
  if (!result.images || result.images.length === 0) {
    const images: string[] = []
    const ogImg = $('meta[property="og:image"]').attr('content')
    if (ogImg && isPropertyImage(ogImg)) images.push(ogImg)
    $('img[src], img[data-src], img[data-lazy-src], img[data-original], img[data-url]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('data-original') || $(el).attr('data-url') || ''
      if (isPropertyImage(src) && !images.includes(src) && images.length < 20) images.push(src)
    })
    $('[srcset]').each((_, el) => {
      const srcset = $(el).attr('srcset') || ''
      srcset.split(',').map(s => s.trim().split(/\s+/)[0]).forEach(src => {
        if (isPropertyImage(src) && !images.includes(src) && images.length < 20) images.push(src)
      })
    })
    if (images.length > 0) result.images = images
  }

  result.agencyName = detectPortal(url)
  return result
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────
function parseHtml(html: string, url: string): Partial<PropertyData> {
  if (url.includes('quintoandar'))                       return scrapeQuintoAndar(html)
  if (url.includes('zapimoveis') || url.includes('vivareal')) return scrapeZapVivaReal(html)
  if (url.includes('olx.com.br'))                        return scrapeOlx(html)
  return scrapeGeneric(html, url)
}

function isGoodExtraction(scraped: Partial<PropertyData>): boolean {
  return !!(
    scraped.title && scraped.title.length > 5 &&
    scraped.priceFormatted && scraped.priceFormatted !== 'Consulte o preço'
  )
}

// ─── Handler principal ────────────────────────────────────────────────────────
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
    } catch (e) { console.warn('Direct fetch failed:', e) }

    // 2ª tentativa: proxy allorigins
    if (partial) {
      try {
        const html = await fetchHtmlViaProxy(url, 'allorigins')
        if (html.length > 1000) {
          const proxied = parseHtml(html, url)
          scraped = mergeScraped(scraped, proxied)
          if (isGoodExtraction(scraped)) partial = false
        }
      } catch (e) { console.warn('allorigins proxy failed:', e) }
    }

    // 3ª tentativa: proxy corsproxy.io
    if (partial) {
      try {
        const html = await fetchHtmlViaProxy(url, 'corsproxy')
        if (html.length > 1000) {
          const proxied = parseHtml(html, url)
          scraped = mergeScraped(scraped, proxied)
          if (isGoodExtraction(scraped)) partial = false
        }
      } catch (e) { console.warn('corsproxy.io failed:', e) }
    }

    // Remove campos vazios
    const cleanedScraped: any = Object.fromEntries(
      Object.entries(scraped).filter(([, v]) => {
        if (v === undefined || v === null || v === '') return false
        if (Array.isArray(v) && v.length === 0) return false
        return true
      })
    )
    if (scraped.bedrooms === 0) cleanedScraped.bedrooms = 0

    // Campos de contato (corretor vai preencher no editor)
    const contactDefaults = {
      phone:      DEMO_PROPERTY.phone,
      whatsapp:   DEMO_PROPERTY.whatsapp,
      email:      DEMO_PROPERTY.email,
      agentName:  DEMO_PROPERTY.agentName,
      agencyName: String(cleanedScraped.agencyName || detectPortal(url)),
      agentCRECI: DEMO_PROPERTY.agentCRECI,
    }

    const propertyDefaults: Partial<PropertyData> = partial ? {
      title:         cleanedScraped.title         || '',
      description:   cleanedScraped.description   || '',
      price:         cleanedScraped.price         || '',
      priceFormatted:cleanedScraped.priceFormatted|| 'Consulte o preço',
      area:          cleanedScraped.area          || '0',
      bedrooms:      cleanedScraped.bedrooms      ?? 0,
      suites:        cleanedScraped.suites        ?? 0,
      bathrooms:     cleanedScraped.bathrooms     ?? 1,
      parking:       cleanedScraped.parking       ?? 0,
      city:          cleanedScraped.city          || '',
      state:         cleanedScraped.state         || '',
      neighborhood:  cleanedScraped.neighborhood  || '',
      address:       cleanedScraped.address       || '',
      zipCode:       cleanedScraped.zipCode       || '',
      images:        Array.isArray(cleanedScraped.images) && cleanedScraped.images.length > 0 ? cleanedScraped.images : DEMO_PROPERTY.images,
      features:      cleanedScraped.features      || [],
      highlights:    cleanedScraped.highlights    || DEMO_PROPERTY.highlights,
      propertyType:  cleanedScraped.propertyType  || 'Apartamento',
    } : cleanedScraped

    const extracted: PropertyData = {
      ...DEMO_PROPERTY,
      ...propertyDefaults,
      ...contactDefaults,
      ...cleanedScraped,
      sourceUrl:   url,
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

// Merge inteligente: complementa campos vazios sem sobrescrever os preenchidos
function mergeScraped(base: Partial<PropertyData>, extra: Partial<PropertyData>): Partial<PropertyData> {
  const merged: any = { ...base }
  for (const [k, v] of Object.entries(extra)) {
    const existing = (base as any)[k]
    if (existing === undefined || existing === null || existing === '' || existing === '0' || existing === 0) {
      if (v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)) {
        merged[k] = v
      }
    }
    // Arrays: usa o maior
    if (Array.isArray(existing) && Array.isArray(v) && v.length > existing.length) {
      merged[k] = v
    }
  }
  return merged
}
