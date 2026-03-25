'use client'

import type { User } from '../../shared/types/user.types'

import { SignOutIcon } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { Avatar, Button, CardWrapper, Separator, Tag, Text } from '@/ui'

type UserMenuProps = {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const logout = useAuthStore(state => state.logout)

  const handleLogout = () => {
    logout()
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
          src={user.profile_picture_url || undefined}
          surname={user.surname ?? undefined}
        />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          {/* Dropdown Menu */}
          <CardWrapper className="absolute! right-0 z-50 mt-4 flex flex-col gap-6" elevation="3">
            {/* User Info Header */}
            <div className="flex flex-col">
              <Text size="m">
                {user.name} {user.surname}
              </Text>
              <Text className="mb-2 truncate text-ellipsis" variant="muted">
                {user.email}
              </Text>
              {user.role && user.role !== 'user' && (
                <Tag variant={user.role === 'admin' ? 0 : 3}>
                  {user.role === 'admin'
                    ? 'Administrador'
                    : user.role === 'moderator'
                      ? 'Moderador'
                      : 'Usuario'}
                </Tag>
              )}
            </div>

            <Separator />
            {/* Menu Items */}
            <div className="flex flex-col gap-1">
              <Button
                fullWidth
                className="justify-start"
                color="muted"
                onClick={() => {
                  router.push('/dashboard/profile')
                  setIsOpen(false)
                }}
                variant="text"
              >
                Ver perfil
              </Button>
              <Button
                fullWidth
                className="justify-start"
                color="danger"
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
