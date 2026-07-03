import { NextRequest, NextResponse } from 'next/server'

// In-memory store — persists within a warm Vercel instance.
// For production, replace with a real database (Supabase, PlanetScale, etc.)
const leadsStore: Map<string, Lead[]> = new Map()

export interface Lead {
  id: string
  landingPageId: string
  landingPageSlug?: string
  landingPageTitle: string
  name: string
  email: string
  whatsapp: string
  message?: string
  source: 'form' | 'whatsapp'
  createdAt: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { landingPageId, landingPageSlug, landingPageTitle, name, email, whatsapp, message, userId } = body

    if (!name || !whatsapp || !landingPageId) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      landingPageId,
      landingPageSlug,
      landingPageTitle: landingPageTitle || 'Imóvel',
      name: name.trim(),
      email: (email || '').trim(),
      whatsapp: whatsapp.trim(),
      message: message || '',
      source: 'form',
      createdAt: new Date().toISOString(),
    }

    // Store by userId so each corretor sees only their leads
    const key = userId || landingPageId
    const existing = leadsStore.get(key) || []
    leadsStore.set(key, [lead, ...existing])

    return NextResponse.json({ success: true, lead })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const landingPageId = searchParams.get('landingPageId')

  if (!userId) {
    return NextResponse.json({ leads: [] })
  }

  let leads = leadsStore.get(userId) || []

  if (landingPageId) {
    leads = leads.filter((l) => l.landingPageId === landingPageId)
  }

  return NextResponse.json({ leads })
}
