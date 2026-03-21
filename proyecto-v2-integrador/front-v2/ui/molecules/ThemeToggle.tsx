'use client'

import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore, type ReactNode } from 'react'

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
   * Icono personalizado para el modo light
   */
  iconLight?: ReactNode

  /**
   * Icono personalizado para el modo dark
   */
  iconDark?: ReactNode

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
 *
 * @example
 * ```tsx
 * <ThemeToggle
 *   size="m"
 *   iconLight={<CustomSunIcon />}
 *   iconDark={<CustomMoonIcon />}
 * />
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

  if (!mounted) return <div className="h-9 w-9" />

  const lightIcon = iconLight || <SunIcon />
  const darkIcon = iconDark || <MoonIcon />

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    setTheme(newTheme)
    onChange?.(newTheme)
  }

  return (
    <Button
      className={className}
      iconLeft={theme === 'dark' ? lightIcon : darkIcon}
      onClick={handleThemeToggle}
      size={size}
      variant="text"
    />
  )
}
