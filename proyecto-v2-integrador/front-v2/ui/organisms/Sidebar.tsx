'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAV_ITEMS, ROUTES } from '@/features/shared/constants/nav.constants'
import { type ViewMode } from '@/features/shared/store/view-mode.store'
import { User } from '@/features/shared/types/user.types'
import { Button, Text, Toggle } from '@/ui'

type SidebarProps = {
  isOpen: boolean
  onClose?: () => void
  user: User
  /** Solo relevante para admins: vista activa (admin o usuario normal). */
  viewMode?: ViewMode
  /** Callback para alternar el viewMode. Solo se renderiza el toggle si se pasa. */
  onToggleViewMode?: () => void
}

export function Sidebar({ user, isOpen, onClose, viewMode, onToggleViewMode }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== ROUTES.dashboard && pathname.startsWith(href + '/'))

  // Si el admin está en vista usuario, filtrar ítems como si fuera 'user'
  const effectiveRole = user.role === 'admin' && viewMode === 'user' ? 'user' : user.role

  const navItems = NAV_ITEMS.filter(
    item => !item.allowedRoles || item.allowedRoles.includes(effectiveRole)
  )

  const isAdmin = user.role === 'admin'
  const inUserMode = viewMode === 'user'

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
        <nav className="flex h-full flex-col gap-3 p-4">
          {/* Nav items */}
          <div className="flex flex-col gap-1">
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
                    variant="text"
                    weight="medium"
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Toggle vista admin/usuario — solo para admins */}
          {isAdmin && onToggleViewMode && (
            <div className="mt-auto flex flex-col gap-4">
              <Text className="border-b border-neutral-200 pb-4" size="2xs" variant="label">
                Modo de visualización
              </Text>
              <Toggle
                checked={!inUserMode}
                color="secondary"
                label="Admin"
                labelLeft="Usuario"
                onChange={() => {
                  onToggleViewMode()
                  onClose?.()
                }}
              />
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}
