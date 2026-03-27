'use client'

import { type Icon, MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

import { Button, type ButtonSize } from '../atoms/Button'

/**
 * Props para el componente ThemeToggle
 */
export interface ThemeToggleProps {
  /**
   * Tamaño del toggle
   * @default 'sm'
   */
  size?: ButtonSize

  /**
   * Icono personalizado para el modo light (cuando el tema es dark, se muestra este para cambiar a light)
   */
  iconLight?: Icon

  /**
   * Icono personalizado para el modo dark (cuando el tema es light, se muestra este para cambiar a dark)
   */
  iconDark?: Icon

  /**
   * Callback cuando el tema cambia
   */
  onChange?: (theme: string | undefined) => void

  /**
   * Clase CSS adicional
   */
  className?: string
}

function subscribe() {
  return () => {}
}

function useIsMounted() {
  //useSyncExternalStore recibe tres argumentos:
  // subscribe,
  // el valor en cliente,
  // y el valor en servidor (snapshot de hidratación).
  // Al devolver false en el servidor y true en el cliente, React sabe que es intencional y no tira el warning.
  return useSyncExternalStore(
    subscribe,
    () => true, // cliente: mounted
    () => false // servidor: no mounted
  )
}

/**
 * Componente ThemeToggle reutilizable
 *
 * Componente molecular para alternar entre temas claro y oscuro.
 * Utiliza next-themes para gestionar la persistencia y sincronización de preferencias.
 *
 * @example
 * ```tsx
 * <ThemeToggle size="sm" />
 * ```

 * ```
 */
export function ThemeToggle({
  size = 'sm',
  iconLight,
  iconDark,
  onChange,
  className
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const mounted = useIsMounted()

  if (!mounted) return <div aria-hidden="true" className="h-9 w-9" role="presentation" />

  const currentIcon = theme === 'dark' ? (iconLight ?? SunIcon) : (iconDark ?? MoonIcon)
  const currentIconClassName = theme === 'dark' ? 'text-amber-200' : 'text-blue-400'

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    setTheme(newTheme)
    onChange?.(newTheme)
  }

  return (
    <Button
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={className}
      iconLeft={currentIcon}
      iconLeftClassName={currentIconClassName}
      onClick={handleThemeToggle}
      size={size}
      variant="text"
    />
  )
}
