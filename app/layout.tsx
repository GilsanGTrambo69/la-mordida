import type { Metadata, Viewport } from 'next'
import { Inter, Anton } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

export const viewport: Viewport = {
  themeColor: '#C62828',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'La Mordida Fusa | Las Mejores Hamburguesas de Fusagasuga',
  description:
    'Las hamburguesas mas grandes y deliciosas de Fusagasuga. Perros calientes, salchipapas, combos y domicilios rapidos. Pide ahora por WhatsApp.',
  keywords: [
    'comida rapida en Fusagasuga',
    'hamburguesas en Fusagasuga',
    'domicilios en Fusagasuga',
    'mejores hamburguesas Fusagasuga',
    'salchipapas en Fusagasuga',
    'La Mordida Fusa',
    'perros calientes Fusagasuga',
  ],
  openGraph: {
    title: 'La Mordida Fusa | Las Mejores Hamburguesas de Fusagasuga',
    description:
      'Las hamburguesas mas grandes y deliciosas de Fusagasuga. Pide ahora por WhatsApp.',
    type: 'website',
    locale: 'es_CO',
    siteName: 'La Mordida Fusa',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${anton.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: 'La Mordida Fusa',
              image: '/images/hero-burger.jpg',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Fusagasuga',
                addressRegion: 'Cundinamarca',
                addressCountry: 'CO',
              },
              servesCuisine: ['Comida Rapida', 'Hamburguesas', 'Street Food'],
              priceRange: '$$',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '320',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
