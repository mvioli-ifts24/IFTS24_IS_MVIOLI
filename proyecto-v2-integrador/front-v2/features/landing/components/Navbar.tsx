'use client'

import Link from 'next/link'
import { List, Moon, Sun, User, UserPlus, X } from 'phosphor-react'
import { useState } from 'react'

import { Button, Heading } from '@/components'
import { useTheme } from '@/shared/providers/ThemeProvider'

/**
 * Navigation Links del header
 */
const navigationLinks = [
  { label: 'Inicio', href: '/#hero' },
  { label: 'Sponsors', href: '#sponsors' }
]

/**
 * Navigation Bar Component
 *
 * Navbar principal con logo, navegación, tema toggle y botones de auth
 * Con scroll dinámico que achica el navbar al hacer scroll
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

  return (
    <header className={`sticky top-4 z-50 flex w-full justify-center`}>
      <div className="bg-background-200/80 w-fit rounded-full px-4 py-4 backdrop-blur-xl transition-all duration-300">
        <div className="flex items-center justify-between gap-24 lg:gap-16">
          {/* Logo */}
          <Link className="group flex items-center gap-2" href="/">
            <Heading level="h1" size="xs" variant="gradient">
              .RANK
            </Heading>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navigationLinks.map(link => (
              <Link
                key={link.href}
                className="text-foreground hover:text-secondary-400 text-sm font-medium transition-colors duration-200"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Placeholder while theme loads */}
            {!mounted && (
              <div className="h-9 w-9 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800" />
            )}
            {/* Theme Toggle - Only render when mounted */}
            {mounted && (
              <Button onClick={toggleTheme} size="s" variant="text">
                {theme === 'light' ? (
                  <Moon className="text-foreground" size={20} />
                ) : (
                  <Sun className="text-foreground" size={20} />
                )}
              </Button>
            )}
            {/* Auth Buttons - Desktop */}
            <div className="hidden items-center gap-3 lg:flex">
              <Button href="/login" size="s" variant="text">
                <User className="mr-2" size={16} />
                Iniciar Sesión
              </Button>
              <Button href="/register" size="s" variant="filled">
                <UserPlus className="mr-2" size={16} />
                Registrarse
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              aria-label="Toggle menu"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="text"
            >
              {isMenuOpen ? (
                <X className="text-foreground" size={20} />
              ) : (
                <List className="text-foreground" size={20} />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mt-4 border-t border-neutral-200 pt-4 lg:hidden dark:border-neutral-800">
            <nav className="flex flex-col gap-4">
              {navigationLinks.map(link => (
                <Link
                  key={link.href}
                  className="text-foreground hover:text-primary-400 py-2 font-medium transition-colors duration-200"
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="mt-4 flex flex-col gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <Button fullWidth href="/login" size="m" variant="text">
                  <User className="mr-2" size={16} />
                  Iniciar Sesión
                </Button>
                <Button fullWidth href="/register" size="m" variant="filled">
                  <UserPlus className="mr-2" size={16} />
                  Registrarse
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
