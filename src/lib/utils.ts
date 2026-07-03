import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LandingPageConfig, PropertyData, SectionConfig } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) : value
  if (isNaN(num)) return 'Consulte o preço'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function createDefaultLP(propertyData: PropertyData): LandingPageConfig {
  const defaultSections: SectionConfig[] = [
    { id: 's1',  type: 'hero',       enabled: true, order: 1 },
    { id: 's2',  type: 'features',   enabled: true, order: 2 },
    { id: 's3',  type: 'gallery',    enabled: true, order: 3 },
    { id: 's4',  type: 'price_box',  enabled: true, order: 4 },
    { id: 's5',  type: 'about',      enabled: true, order: 5 },
    { id: 's6',  type: 'amenities',  enabled: true, order: 6 },
    { id: 's7',  type: 'highlights', enabled: propertyData.highlights.length > 0, order: 7 },
    { id: 's8',  type: 'cta_mid',    enabled: true, order: 8 },
    { id: 's9',  type: 'location',   enabled: true, order: 9 },
    { id: 's10', type: 'agent',      enabled: true, order: 10 },
    { id: 's11', type: 'contact',    enabled: true, order: 11 },
    { id: 's12', type: 'footer',     enabled: true, order: 12 },
  ]

  return {
    id: generateId(),
    propertyData,
    theme: 'modern',
    primaryColor: '#f59e0b',
    secondaryColor: '#0f172a',
    accentColor: '#fbbf24',
    fontFamily: 'plus-jakarta',
    fontSize: 'normal',
    borderRadius: 'large',
    heroStyle: 'full',
    sections: defaultSections,
    ctaPrimary: 'Agendar Visita',
    ctaSecondary: 'Falar no WhatsApp',
    ctaWhatsApp: `https://wa.me/${formatWhatsApp(propertyData.whatsapp)}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${propertyData.title}`)}`,
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPremium: true,
    trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

export const PROPERTY_ICONS: Record<string, string> = {
  'piscina': '🏊',
  'churrasqueira': '🍖',
  'área gourmet': '🍽️',
  'academia': '💪',
  'condomínio fechado': '🔒',
  'segurança': '🛡️',
  'varanda': '🏡',
  'energia solar': '☀️',
  'automação': '🏠',
  'playground': '🎪',
  'salão de festas': '🎉',
  'quadra': '🎾',
  'elevador': '🛗',
  'portaria 24h': '👮',
  'pet friendly': '🐾',
  'jardim': '🌿',
  'sauna': '🧖',
  'coworking': '💻',
  'spa': '💆',
  'heliponto': '🚁',
}
