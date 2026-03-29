'use client'

import { ListIcon, XIcon } from '@phosphor-icons/react'

import { User } from '@/features/shared/types/user.types'
import { Button, Logo, ThemeToggle } from '@/ui'

import { UserMenu } from './UserMenu'

export type NavbarProps = {
  onMenuToggle?: () => void
  sidebarOpen?: boolean
  user: User
  onLogout: () => void
}

export function Navbar({ onMenuToggle, sidebarOpen, user, onLogout }: NavbarProps) {
  return (
    <nav className="bg-surface shadow-foreground/6 box-border flex justify-between gap-4 border-b border-neutral-200 px-4 py-2 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          className="lg:hidden"
          iconLeft={sidebarOpen ? XIcon : ListIcon}
          onClick={onMenuToggle}
          variant="text"
        />

        <Logo size="sm" />
      </div>

      {/* Right: Theme Toggle + User Menu */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* User Menu */}
        <UserMenu onLogout={onLogout} user={user} />
      </div>
    </nav>
  )
}
