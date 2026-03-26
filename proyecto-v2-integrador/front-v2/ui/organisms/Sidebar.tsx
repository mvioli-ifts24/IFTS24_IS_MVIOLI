'use client'

import {
  BookOpenIcon,
  FolderOpenIcon,
  GraduationCapIcon,
  HashIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  UserCircleGearIcon,
  UsersIcon
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { User, UserRole } from '@/features/shared/types/user.types'
import { Button } from '@/ui'

type NavItem = {
  label: string
  href: string
  icon: typeof HouseIcon
  allowedRoles?: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/dashboard', icon: HouseIcon },
  {
    label: 'Búsqueda',
    href: '/dashboard/search',
    icon: MagnifyingGlassIcon,
    allowedRoles: ['user', 'moderator']
  },
  {
    label: 'Ayuda',
    href: '/dashboard/help',
    icon: BookOpenIcon,
    allowedRoles: ['user', 'moderator']
  },
  { label: 'Usuarios', href: '/dashboard/users', icon: UsersIcon, allowedRoles: ['admin'] },
  {
    label: 'Administradores',
    href: '/dashboard/admins',
    icon: UserCircleGearIcon,
    allowedRoles: ['admin']
  },
  {
    label: 'Banners',
    href: '/dashboard/banners',
    icon: FolderOpenIcon,
    allowedRoles: ['admin']
  },
  { label: 'Sponsors', href: '/dashboard/sponsors', icon: HashIcon, allowedRoles: ['admin'] },
  { label: 'Sobre Nosotros', href: '/dashboard/about', icon: GraduationCapIcon }
]

type SidebarProps = {
  isOpen: boolean
  onClose?: () => void
  user: User
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))

  const navItems = NAV_ITEMS.filter(
    item => !item.allowedRoles || item.allowedRoles.includes(user.role)
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`bg-surface shadow-foreground/4 fixed top-(--navbar-height) left-0 z-40 h-[calc(100vh-var(--navbar-height))] w-fit transform border-r border-neutral-200 shadow-sm transition-transform duration-300 lg:relative lg:top-0 lg:h-auto lg:transform-none lg:border-t-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <nav className="flex flex-col gap-3 p-4">
          {navItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <Button
                  fullWidth
                  className="justify-start"
                  color={active ? 'primary' : 'muted'}
                  iconLeft={<Icon size={20} weight="bold" />}
                  size="sm"
                  variant="text"
                  weight="medium"
                >
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
