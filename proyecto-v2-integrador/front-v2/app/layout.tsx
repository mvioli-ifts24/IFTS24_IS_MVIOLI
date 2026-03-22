import type { Metadata } from 'next'

import { Montserrat, Roboto } from 'next/font/google'

import { ThemeProvider } from '@/shared/providers/ThemeProvider'

import './globals.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap'
})

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: '.RANK',
  description:
    'Comparte tus reseñas de juegos, descubre nuevos títulos y conecta con la comunidad gaming. Lee opiniones verificadas, califica juegos y encuentra periféricos en nuestros sponsors.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      suppressHydrationWarning
      className={`${montserrat.variable} ${roboto.variable} h-full scroll-smooth antialiased`}
      lang="es"
    >
      <body className="h-full w-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
