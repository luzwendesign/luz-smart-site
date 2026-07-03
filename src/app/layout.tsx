import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Luz Smart Site — Landing Pages de Alta Conversão para Imóveis',
  description: 'Crie landing pages profissionais para imóveis em minutos. Cole o link do anúncio e a IA gera sua página automaticamente.',
  keywords: 'landing page imóveis, corretor de imóveis, site imobiliária, gerador landing page',
  openGraph: {
    title: 'Luz Smart Site',
    description: 'Landing pages de alta conversão para corretores e imobiliárias',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#f59e0b', secondary: '#0f172a' },
            },
          }}
        />
      </body>
    </html>
  )
}
