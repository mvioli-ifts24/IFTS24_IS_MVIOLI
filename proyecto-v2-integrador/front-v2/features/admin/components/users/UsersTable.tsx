'use client'

import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'

import { type User, type UserRoleOption } from '@/features/shared/types/user.types'
import {
  Avatar,
  type ColumnDef,
  type FilterGroup,
  SearchFiltersTable,
  type TableActionDef,
  Tag,
  type TagVariant,
  Text
} from '@/ui'

const ROLE_TAG_VARIANT: Record<string, TagVariant> = {
  admin: 'primary',
  moderator: 'secondary',
  user: 'neutral'
}

export interface UsersTableProps {
  users: User[]
  roles: UserRoleOption[]
  onEditRole: (user: User) => void
  onDelete: (user: User) => void
  filterRoleId: number | null
  onFilterRoleIdChange: (id: number | null) => void
  onSearchChange: (value: string) => void
  search: string
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  page: number
  pageSize: number
  total: number
  loading?: boolean
}

export function UsersTable({
  users,
  roles,
  onEditRole,
  onDelete,
  filterRoleId,
  onFilterRoleIdChange,
  onSearchChange,
  search,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  total,
  loading
}: UsersTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      id: 'user',
      header: 'Usuario',
      cell: user => (
        <div className="flex items-center gap-3">
          <Avatar
            alt={`${user.name ?? ''} ${user.surname ?? ''}`.trim() || user.email}
            name={user.name ?? undefined}
            size="sm"
            src={user?.profile_picture_url}
            surname={user.surname ?? undefined}
          />
          <Text size="sm" weight="medium">
            {user.name && user.surname
              ? `${user.name} ${user.surname}`
              : (user.name ?? user.surname ?? '—')}
          </Text>
        </div>
      )
    },
    {
      id: 'email',
      header: 'Email',
      cell: user => (
        <Text color="muted" size="sm">
          {user.email}
        </Text>
      )
    },
    {
      id: 'role',
      header: 'Rol',
      cell: user => (
        <Tag variant={ROLE_TAG_VARIANT[user.role] ?? 'neutral'}>
          {roles.find(r => r.name === user.role)?.label ?? user.role}
        </Tag>
      )
    }
  ]

  const actions: TableActionDef<User>[] = [
    {
      icon: PencilSimpleIcon,
      label: 'Editar rol',
      onClick: onEditRole
    },
    {
      icon: TrashIcon,
      label: 'Eliminar usuario',
      color: 'danger',
      onClick: onDelete
    }
  ]

  const filters: FilterGroup[] = [
    {
      id: 'role',
      label: 'Rol',
      options: roles.map(r => ({ value: r.id, label: r.label })),
      value: filterRoleId ?? 0,
      defaultValue: 0,
      onChange: v => onFilterRoleIdChange(v === 0 ? null : (v as number))
    }
  ]

  return (
    <SearchFiltersTable
      actions={actions}
      columns={columns}
      data={users}
      emptyMessage="No se encontraron usuarios."
      filters={filters}
      keyExtractor={user => user.id}
      loading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onSearchChange={onSearchChange}
      page={page}
      pageSize={pageSize}
      search={search}
      total={total}
    />
  )
}
