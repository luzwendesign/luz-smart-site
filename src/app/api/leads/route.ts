import { NextRequest, NextResponse } from 'next/server'
import { sql, initDb } from '@/lib/db'

export interface Lead {
  id: string
  userId: string
  landingPageId: string
  landingPageSlug?: string
  landingPageTitle: string
  name: string
  email: string
  whatsapp: string
  message?: string
  source: string
  createdAt: string
}

let dbReady = false

async function ensureDb() {
  if (!dbReady) {
    await initDb()
    dbReady = true
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb()

    const body = await req.json()
    const { landingPageId, landingPageSlug, landingPageTitle, name, email, whatsapp, message, userId } = body

    if (!name || !whatsapp || !landingPageId || !userId) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    await sql`
      INSERT INTO leads (id, user_id, landing_page_id, landing_page_slug, landing_page_title, name, email, whatsapp, message, source)
      VALUES (
        ${id},
        ${userId},
        ${landingPageId},
        ${landingPageSlug || null},
        ${landingPageTitle || 'Imóvel'},
        ${name.trim()},
        ${(email || '').trim()},
        ${whatsapp.trim()},
        ${message || null},
        'form'
      )
    `

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('Leads POST error:', err)
    return NextResponse.json({ error: 'Erro ao salvar lead.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureDb()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const landingPageId = searchParams.get('landingPageId')

    if (!userId) {
      return NextResponse.json({ leads: [] })
    }

    let rows

    if (landingPageId) {
      rows = await sql`
        SELECT * FROM leads
        WHERE user_id = ${userId} AND landing_page_id = ${landingPageId}
        ORDER BY created_at DESC
      `
    } else {
      rows = await sql`
        SELECT * FROM leads
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `
    }

    const leads: Lead[] = rows.map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      landingPageId: r.landing_page_id,
      landingPageSlug: r.landing_page_slug,
      landingPageTitle: r.landing_page_title,
      name: r.name,
      email: r.email || '',
      whatsapp: r.whatsapp,
      message: r.message || '',
      source: r.source,
      createdAt: r.created_at,
    }))

    return NextResponse.json({ leads })
  } catch (err) {
    console.error('Leads GET error:', err)
    return NextResponse.json({ leads: [] })
  }
}
