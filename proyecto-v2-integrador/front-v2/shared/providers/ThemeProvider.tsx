'use client'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { Toaster } from 'sonner'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
      <Toaster closeButton richColors theme={theme === 'dark' ? 'dark' : 'light'} />
    </NextThemesProvider>
  )
}
