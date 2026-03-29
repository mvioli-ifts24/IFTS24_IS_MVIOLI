'use client'

import { PencilSimpleIcon, SealCheckIcon, SealWarningIcon } from '@phosphor-icons/react'

import { User } from '@/features/shared/types/user.types'
import { Avatar, Button, Heading, Tag, Text } from '@/ui'

type ProfileHeaderProps = {
  user: User
  onVerifyAccount: () => void
  onEdit: () => void
}

export function ProfileHeader({ user, onVerifyAccount, onEdit }: ProfileHeaderProps) {
  const isVerified = Boolean(user.email_verified)

  return (
    <div className="flex gap-4">
      <Avatar
        name={user.name || undefined}
        size="xl"
        src={user.profile_picture_url}
        surname={user.surname || undefined}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <Heading className="truncate" level="h2" size="xs">
            {user.name || 'Sin nombre'} {user.surname || ''}
          </Heading>
          <div className="flex items-center gap-2">
            {!isVerified && (
              <Button onClick={onVerifyAccount} size="xs" variant="text">
                Verificar mi cuenta
              </Button>
            )}
            <Button iconLeft={PencilSimpleIcon} onClick={onEdit} size="xs" variant="outlined">
              Editar
            </Button>
          </div>
        </div>
        <Text className="truncate" color="muted">
          {user.email}
        </Text>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {user.role && user.role !== 'user' && (
            <Tag variant={user.role === 'admin' ? 'primary' : 'neutral'}>
              {user.role === 'admin'
                ? 'Administrador'
                : user.role === 'moderator'
                  ? 'Moderador'
                  : 'Usuario'}
            </Tag>
          )}
          <Tag className="flex gap-1" variant={isVerified ? 'secondary' : 'danger'}>
            {isVerified ? (
              <SealCheckIcon size={16} weight="bold" />
            ) : (
              <SealWarningIcon size={16} weight="bold" />
            )}
            {isVerified ? 'Cuenta verificada' : 'Cuenta sin verificar'}
          </Tag>
        </div>
      </div>
    </div>
  )
}
