import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Qalam — Yozuvchilar Platformasi',
    template: '%s | Qalam',
  },
  description: 'Ssenariynavislar, shoirlar va yozuvchilar uchun zamonaviy ijodiy yozish platformasi.',
  keywords: ['yozuvchi', 'ssenariy', "she'r", 'hikoya', 'ijod', 'qalam'],
  authors: [{ name: 'Qalam' }],
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Qalam',
    title: 'Qalam — Yozuvchilar Platformasi',
    description: "Ssenariynavislar, shoirlar va yozuvchilar uchun zamonaviy ijodiy yozish platformasi.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
