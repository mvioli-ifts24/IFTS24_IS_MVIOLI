import { UserIcon, UserPlusIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { Button, ButtonColor, ButtonVariant, Heading } from '@/ui'
import { ThemeToggle } from '@/ui/molecules/ThemeToggle'

import { MobileMenuLinks } from './MobileMenuLinks'

export interface NavLink {
  label: string
  href: string
  icons?: React.ReactNode
  variant: ButtonVariant
  color?: ButtonColor
}

const navigationLinks: NavLink[] = [
  { label: 'Inicio', href: '/#hero', variant: 'text', color: 'secondary' },
  { label: 'Sponsors', href: '#sponsors', variant: 'text', color: 'secondary' }
]

const authLinks: NavLink[] = [
  {
    label: 'Iniciar Sesión',
    href: '/login',
    icons: <UserIcon className="mr-2" size={16} />,
    variant: 'text'
  },
  {
    label: 'Registrarse',
    href: '/register',
    icons: <UserPlusIcon className="mr-2" size={16} />,
    variant: 'filled'
  }
]

export function Navbar() {
  return (
    <header className="sticky top-4 z-50 flex w-full justify-center">
      <details className="group relative w-fit">
        <summary className="bg-background/80 cursor-pointer list-none rounded-full px-4 py-4 backdrop-blur-xl transition-all duration-300">
          <div className="flex items-center justify-between gap-24 lg:gap-16">
            <Link className="flex items-center gap-2" href="/">
              <Heading level="h1" size="xs" variant="gradient">
                .RANK
              </Heading>
            </Link>

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

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <div className="hidden items-center gap-3 lg:flex">
                <Button
                  href="/login"
                  iconLeft={<UserIcon className="mr-2" size={16} />}
                  size="sm"
                  variant="text"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  href="/register"
                  iconLeft={<UserPlusIcon className="mr-2" size={16} />}
                  size="sm"
                  variant="filled"
                >
                  Registrarse
                </Button>
              </div>

              <div className="rounded-lg p-2 transition-colors hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800">
                <svg
                  className="block group-open:hidden"
                  fill="none"
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                >
                  <path
                    d="M3 5h14M3 10h14M3 15h14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                </svg>
                <svg
                  className="hidden group-open:block"
                  fill="none"
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                >
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </summary>

        <div className="animate-in fade-in slide-in-from-top-2 bg-background/80 absolute top-full right-0 left-0 mt-2 overflow-hidden rounded-2xl border border-neutral-200 backdrop-blur-xl duration-200 lg:hidden dark:border-neutral-800">
          <MobileMenuLinks links={navigationLinks} />

          <MobileMenuLinks links={authLinks} />
        </div>
      </details>
    </header>
  )
}
