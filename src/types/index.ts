export interface PropertyData {
  // Básico
  title: string
  description: string
  price: string
  priceFormatted: string

  // Localização
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  mapUrl: string
  latitude?: number
  longitude?: number

  // Características
  area: string
  bedrooms: number
  suites: number
  bathrooms: number
  parking: number
  floor?: string
  totalFloors?: string
  condoFee?: string
  iptu?: string

  // Diferenciais
  features: string[]
  highlights: string[]
  availableItems: string[]
  unavailableItems: string[]

  // Mídia
  images: string[]
  videoUrl?: string
  tourUrl?: string

  // Imobiliária / Corretor
  agencyName: string
  agencyLogo?: string
  agentName: string
  agentPhoto?: string
  agentCRECI?: string
  phone: string
  whatsapp: string
  email: string
  instagram?: string
  tiktok?: string
  facebook?: string

  // SEO (gerado pela IA)
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  slug?: string
  schema?: string

  // Extras
  propertyType: string
  listingType: 'venda' | 'aluguel' | 'temporada'
  sourceUrl: string
  extractedAt: string
}

export interface LandingPageConfig {
  id: string
  propertyData: PropertyData

  // Design
  theme: 'modern' | 'clean' | 'luxury' | 'minimal'
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: 'plus-jakarta' | 'inter' | 'poppins' | 'playfair'
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  heroStyle: 'full' | 'split' | 'minimal'

  // Sections visibility & order
  sections: SectionConfig[]

  // CTA
  ctaPrimary: string
  ctaSecondary: string
  ctaWhatsApp: string

  // Integrações
  pixelMeta?: string
  googleAnalytics?: string
  googleTagManager?: string
  customScripts?: string

  // Domínio / Link
  domain?: string
  subdomain?: string
  customSlug?: string

  // Typography
  fontSize?: 'small' | 'normal' | 'large' | 'xlarge'

  // Dono da LP
  userId?: string

  // Status
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string

  // Trial
  isPremium: boolean
  trialEndsAt?: string
}

export interface SectionConfig {
  id: string
  type: SectionType
  enabled: boolean
  order: number
  customTitle?: string
  customContent?: string
}

export type SectionType =
  | 'hero'
  | 'features'
  | 'gallery'
  | 'about'
  | 'highlights'
  | 'price_box'
  | 'amenities'
  | 'location'
  | 'contact'
  | 'cta_mid'
  | 'agent'
  | 'footer'

export interface Lead {
  id: string
  landingPageId: string
  name: string
  email: string
  whatsapp: string
  phone?: string
  message?: string
  source: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  photo?: string
  plan: 'free' | 'premium'
  trialEndsAt?: string
  createdAt: string
  creci?: string
  phone?: string
  whatsapp?: string
}

export interface ExtractionResult {
  success: boolean
  data?: PropertyData
  error?: string
  partial?: boolean
}
