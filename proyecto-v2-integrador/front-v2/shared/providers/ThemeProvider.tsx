'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * Tipos para el contexto de tema
 */
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

/**
 * Context para manejar el tema dark/light
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Hook para usar el contexto de tema
 */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

/**
 * Provider del contexto de tema
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Detectar tema inicial - siempre comienza en dark por defecto
  useEffect(() => {
    const initializeTheme = () => {
      setMounted(true)

      const savedTheme = localStorage.getItem('theme') as Theme | null
      // Siempre usar 'dark' como tema por defecto, ignorar preferencias del sistema
      const initialTheme = savedTheme || 'dark'

      setTheme(initialTheme)

      // Aplicar tema inmediatamente
      const root = window.document.documentElement

      root.classList.remove('light', 'dark')
      root.classList.add(initialTheme)
    }

    initializeTheme()
  }, [])

  // Aplicar tema al DOM cuando cambia
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}
