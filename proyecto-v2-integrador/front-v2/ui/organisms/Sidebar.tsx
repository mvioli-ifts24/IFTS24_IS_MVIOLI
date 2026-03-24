'use client'

import {
  BookIcon,
  FolderOpenIcon,
  GraduationCapIcon,
  HashIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UsersIcon
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/ui'

import { User } from '../../shared/types/user.types'

const REVIEWER_NAV = [
  { label: 'Inicio', href: '/dashboard', icon: HouseIcon },
  { label: 'Búsqueda', href: '/dashboard/search', icon: MagnifyingGlassIcon },
  { label: 'Perfil', href: '/dashboard/profile', icon: UserIcon },
  { label: 'Sobre Nosotros', href: '/dashboard/about', icon: GraduationCapIcon }
]

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: HouseIcon },
  { label: 'Usuarios', href: '/admin/users', icon: UsersIcon },
  { label: 'Reviewers', href: '/admin/reviewers', icon: BookIcon },
  { label: 'Banners', href: '/admin/banners', icon: FolderOpenIcon },
  { label: 'Sponsors', href: '/admin/sponsors', icon: HashIcon }
]

type SidebarProps = {
  isOpen: boolean
  onClose?: () => void
  user: User
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  // Default to REVIEWER_NAV while hydrating

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const navItems = user.role === 'admin' ? ADMIN_NAV : REVIEWER_NAV

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
