'use client'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { Toaster } from 'sonner'

function ToasterWithTheme() {
  const { theme } = useTheme()

  return <Toaster closeButton richColors theme={theme === 'dark' ? 'dark' : 'light'} />
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
      <ToasterWithTheme />
    </NextThemesProvider>
  )
}
