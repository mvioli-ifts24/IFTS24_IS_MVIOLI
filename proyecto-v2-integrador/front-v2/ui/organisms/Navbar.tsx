'use client'

import { ListIcon, XIcon } from '@phosphor-icons/react'

import { Button, Logo, ThemeToggle } from '@/ui'

import { User } from '../../shared/types/user.types'

import { UserMenu } from './UserMenu'

type NavbarProps = {
  onMenuToggle?: () => void
  sidebarOpen?: boolean
  user: User
}

export function Navbar({ onMenuToggle, sidebarOpen, user }: NavbarProps) {
  return (
    <nav className="bg-background box-border flex justify-between gap-4 border-b border-neutral-100 px-4 py-2">
      <div className="flex items-center gap-4">
        <Button
          className="lg:hidden"
          iconLeft={
            sidebarOpen ? <XIcon size={20} weight="bold" /> : <ListIcon size={20} weight="bold" />
          }
          onClick={onMenuToggle}
          variant="text"
        />

        <Logo size="sm" />
      </div>

      {/* Right: Theme Toggle + User Menu */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* User Menu */}
        <UserMenu user={user} />
      </div>
    </nav>
  )
}
