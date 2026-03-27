'use client'

import { type Icon, ListIcon, UserIcon, UserPlusIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import { Button, type ButtonColor, type ButtonVariant, Logo, Separator, ThemeToggle } from '@/ui'

import { MenuLinks } from './MenuLinks'

export interface NavLink {
  label: string
  href: string
  icon?: Icon
  variant: ButtonVariant
  color?: ButtonColor
}

const navigationLinks: NavLink[] = [
  { label: 'Inicio', href: '/#hero', variant: 'action', color: 'secondary' },
  { label: 'Sponsors', href: '#sponsors', variant: 'action', color: 'secondary' }
]

const authLinks: NavLink[] = [
  {
    label: 'Iniciar Sesión',
    href: '/login',
    icon: UserIcon,
    variant: 'text'
  },
  {
    label: 'Registrarse',
    href: '/register',
    icon: UserPlusIcon,
    variant: 'filled'
  }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click fuera del navbar
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    // Cerrar con Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Cerrar al cambiar de ruta (click en un link del menú)
  const handleClose = () => setIsOpen(false)

  return (
    <header className="sticky top-4 z-50 flex w-full justify-center">
      <div ref={navRef} className="relative w-fit">
        <div className="bg-background/50 rounded-full px-4 py-4 shadow shadow-neutral-200 backdrop-blur-lg transition-all duration-300">
          <div className="flex items-center justify-between gap-24 lg:gap-16">
            <Logo />

            <nav className="hidden items-center gap-8 lg:flex">
              <MenuLinks links={navigationLinks} onClose={handleClose} />
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <div className="hidden items-center gap-3 lg:flex">
                <MenuLinks links={authLinks} onClose={handleClose} />
              </div>

              {/* Botón hamburguesa — solo visible en móvil */}
              <Button
                className="lg:hidden"
                iconLeft={isOpen ? XIcon : ListIcon}
                onClick={() => setIsOpen(prev => !prev)}
                variant="text"
              />
            </div>
          </div>
        </div>

        {/* Menú móvil con animación controlada por estado */}
        <div
          className={[
            'bg-background/50 absolute right-0 -bottom-54 left-0 flex flex-col gap-2 overflow-hidden rounded-2xl p-4 shadow shadow-neutral-200 backdrop-blur-lg lg:hidden',
            'transition-all duration-200 ease-out',
            isOpen
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          ].join(' ')}
        >
          <nav className="flex flex-col gap-2">
            <MenuLinks links={navigationLinks} onClose={handleClose} />
          </nav>
          <Separator />
          <div className="flex flex-col gap-2">
            <MenuLinks links={authLinks} onClose={handleClose} />
          </div>
        </div>
      </div>
    </header>
  )
}
