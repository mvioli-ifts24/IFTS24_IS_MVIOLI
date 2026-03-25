'use client'

import {
  FolderOpenIcon,
  GraduationCapIcon,
  HashIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  UserCircleGearIcon,
  UserIcon,
  UsersIcon
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/ui'

import { User, UserRole } from '../../shared/types/user.types'

type NavItem = {
  label: string
  href: string
  icon: typeof HouseIcon
  allowedRoles?: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  // Inicio - accesible por todos
  { label: 'Inicio', href: '/dashboard', icon: HouseIcon },

  // Rutas compartidas
  {
    label: 'Búsqueda',
    href: '/dashboard/search',
    icon: MagnifyingGlassIcon,
    allowedRoles: ['user', 'moderator']
  },
  { label: 'Perfil', href: '/dashboard/profile', icon: UserIcon },
  { label: 'Sobre Nosotros', href: '/dashboard/about', icon: GraduationCapIcon },
  {
    label: 'Ayuda',
    href: '/dashboard/help',
    icon: GraduationCapIcon,
    allowedRoles: ['user', 'moderator']
  },

  // Rutas administrativas
  { label: 'Usuarios', href: '/dashboard/admin/users', icon: UsersIcon, allowedRoles: ['admin'] },
  {
    label: 'Administradores',
    href: '/dashboard/admin/admins',
    icon: UserCircleGearIcon,
    allowedRoles: ['admin']
  },
  {
    label: 'Banners',
    href: '/dashboard/admin/banners',
    icon: FolderOpenIcon,
    allowedRoles: ['admin']
  },
  { label: 'Sponsors', href: '/dashboard/admin/sponsors', icon: HashIcon, allowedRoles: ['admin'] }
]

type SidebarProps = {
  isOpen: boolean
  onClose?: () => void
  user: User
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const navItems = NAV_ITEMS.filter(
    item => !item.allowedRoles || item.allowedRoles.includes(user.role)
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`bg-background fixed top-14.25 left-0 z-40 h-[calc(100vh-57px)] w-fit transform border-r border-neutral-200 transition-transform duration-300 lg:relative lg:top-0 lg:h-auto lg:transform-none lg:border-t-0 ${
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
