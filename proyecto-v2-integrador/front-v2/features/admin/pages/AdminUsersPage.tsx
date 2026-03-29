'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useTableQueryParams } from '@/features/shared/hooks/useTableQueryParams'
import { useModal } from '@/features/shared/store/modals.store'
import { type User, type UserRoleOption } from '@/features/shared/types/user.types'
import { CardWrapper } from '@/ui'

import { DeleteUserModal } from '../components/users/DeleteUserModal'
import { EditUserRoleModal } from '../components/users/EditUserRoleModal'
import { UsersTable } from '../components/users/UsersTable'
import { AdminService } from '../services/admin.service'
import { UsersAdminService } from '../services/users.service'

export function AdminUsersPage() {
  const { token } = useAuthStore()

  // Datos
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<UserRoleOption[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [total, setTotal] = useState(0)

  // URL query params — search, filtros y paginación sincronizados con la URL
  const {
    search,
    urlSearch,
    page,
    pageSize,
    getFilter,
    setSearch,
    setFilter,
    setPage,
    setPageSize
  } = useTableQueryParams({ defaultPageSize: 5 })

  const filterRoleIdStr = getFilter('role')
  const filterRoleId = filterRoleIdStr ? parseInt(filterRoleIdStr) : null

  // Modales
  const { open: openEditModal } = useModal(MODAL_IDS.ADMIN_EDIT_USER_ROLE)
  const { open: openDeleteModal } = useModal(MODAL_IDS.ADMIN_DELETE_USER)

  // Cargar roles (una sola vez)
  useEffect(() => {
    if (!token) return
    AdminService.getRoles(token).then(res => {
      if (!res.error && res.data) setRoles(res.data)
    })
  }, [token])

  // Fetch de usuarios — se dispara al cambiar cualquier parámetro de la URL
  const fetchUsers = useCallback(async () => {
    if (!token) return

    try {
      const response = await UsersAdminService.getAll(token, {
        page,
        pageSize,
        search: urlSearch || undefined,
        role_id: filterRoleId ?? undefined
      })

      if (response.error) {
        toast.error(response.error)
      } else {
        setUsers(response.data ?? [])
        setTotal(response.total ?? 0)
      }
    } catch {
      toast.error('No se pudo conectar con el servidor.')
    } finally {
      setInitialLoading(false)
    }
  }, [token, page, pageSize, urlSearch, filterRoleId])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Handlers de modales
  const handleEditRole = (user: User) => {
    setSelectedUser(user)
    openEditModal()
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    openDeleteModal()
  }

  // Handlers de éxito
  const handleRoleUpdated = (updated: User) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
  }

  const handleDeleted = (userId: number) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    setTotal(prev => prev - 1)

    // Si eliminamos el último elemento de una página > 1, retroceder
    const remainingOnPage = users.length - 1

    if (remainingOnPage === 0 && page > 1) {
      setPage(page - 1)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <CardWrapper elevation="0">
        <UsersTable
          filterRoleId={filterRoleId}
          loading={initialLoading}
          onDelete={handleDelete}
          onEditRole={handleEditRole}
          onFilterRoleIdChange={id => setFilter('role', id ? String(id) : null)}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSearchChange={setSearch}
          page={page}
          pageSize={pageSize}
          roles={roles}
          search={search}
          total={total}
          users={users}
        />
      </CardWrapper>

      <EditUserRoleModal onSuccess={handleRoleUpdated} roles={roles} user={selectedUser} />
      <DeleteUserModal onSuccess={handleDeleted} user={selectedUser} />
    </section>
  )
}
