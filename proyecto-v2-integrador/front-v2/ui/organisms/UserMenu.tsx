'use client'

import type { User } from '../../shared/types/user.types'

import { SignOutIcon } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Avatar, Button, CardWrapper, Separator, Tag, Text } from '@/ui'

type UserMenuProps = {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    // logout()
    // cookieUtils.remove('token')
    setIsOpen(false)
    router.push('/login')
  }

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button onClick={() => setIsOpen(!isOpen)}>
        <Avatar
          className="cursor-pointer hover:border-neutral-200"
          name={user.email}
          size="m"
          surname={user.surname}
        />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          {/* Dropdown Menu */}
          <CardWrapper className="absolute! right-0 z-50 mt-4 flex flex-col gap-2" elevation="3">
            {/* User Info Header */}
            <div className="mb-3 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <Text size="m">
                  {user.name} {user.surname}
                </Text>
                <Text className="truncate text-ellipsis" variant="muted">
                  {user.email}
                </Text>
              </div>
            </div>
            {user.role && user.role !== 'user' && (
              <Tag variant={user.role === 'admin' ? 1 : 2}>
                {user.role === 'admin'
                  ? 'Administrador'
                  : user.role === 'moderator'
                    ? 'Moderador'
                    : 'Usuario'}
              </Tag>
            )}
            <Separator />
            {/* Menu Items */}
            <div className="flex flex-col gap-1">
              <Button
                fullWidth
                className="justify-start"
                color="muted"
                onClick={() => router.push('/profile')}
                variant="text"
              >
                Ver perfil
              </Button>
              <Button
                fullWidth
                className="justify-start"
                color="muted"
                iconLeft={<SignOutIcon size={18} />}
                onClick={handleLogout}
                variant="text"
              >
                Cerrar sesión
              </Button>
            </div>
          </CardWrapper>
        </>
      )}
    </div>
  )
}
