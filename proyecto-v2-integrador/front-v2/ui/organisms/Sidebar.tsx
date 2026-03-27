'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAV_ITEMS, ROUTES } from '@/features/shared/constants/nav.constants'
import { User } from '@/features/shared/types/user.types'
import { Button } from '@/ui'

type SidebarProps = {
  isOpen: boolean
  onClose?: () => void
  user: User
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== ROUTES.dashboard && pathname.startsWith(href + '/'))

  const navItems = NAV_ITEMS.filter(
    item => !item.allowedRoles || item.allowedRoles.includes(user.role)
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`bg-surface shadow-foreground/4 absolute left-0 z-40 h-full w-fit transform border-r border-neutral-200 shadow-sm transition-transform duration-300 lg:relative lg:top-0 lg:h-auto lg:transform-none lg:border-t-0 lg:shadow-none ${
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
                  iconLeft={Icon}
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
