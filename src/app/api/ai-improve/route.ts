import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { field, value, context } = await req.json()

    await new Promise((r) => setTimeout(r, 1000))

    const improvements: Record<string, string> = {
      title: `${value} — Oportunidade Única de Investimento`,
      description: `${value}\n\nEste imóvel excepcional combina localização privilegiada com acabamento de alto padrão. Ideal para famílias que buscam conforto e segurança em uma região valorizada da cidade.`,
      seoTitle: `${value} | Alta Conversão`,
      seoDescription: `Conheça este imóvel incrível! ${value.substring(0, 100)}... Agende sua visita hoje mesmo e realize o sonho da casa própria.`,
    }

    return NextResponse.json({
      improved: improvements[field] || value,
    })
  } catch {
    return NextResponse.json({ error: 'Erro na IA' }, { status: 500 })
  }
}
