'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type User, type UserRoleOption } from '@/features/shared/types/user.types'
import { CardWrapper, ConfirmActionModal } from '@/ui'

import { EditUserRoleModal } from '../components/users/EditUserRoleModal'
import { UsersTable } from '../components/users/UsersTable'
import { useAdminCrud } from '../hooks/useAdminCrud'
import { AdminService } from '../services/admin.service'
import { UsersAdminService } from '../services/users.service'

export function AdminUsersPage() {
  const { token } = useAuthStore()
  const [roles, setRoles] = useState<UserRoleOption[]>([])

  const { open: openEditModal } = useModal(MODAL_IDS.ADMIN_EDIT_USER_ROLE)
  const {
    isOpen: isDeleteOpen,
    open: openDeleteModal,
    close: closeDelete
  } = useModal(MODAL_IDS.ADMIN_DELETE_USER)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const {
    items: users,
    setItems: setUsers,
    initialLoading,
    selected: selectedUser,
    setSelected: setSelectedUser,
    total,
    setTotal,
    tableParams: { search, page, pageSize, getFilter, setSearch, setFilter, setPage, setPageSize }
  } = useAdminCrud<User>({
    token,
    fetchFn: ({ page, pageSize, urlSearch, getFilter }) => {
      const filterRoleIdStr = getFilter('role')
      const role_id = filterRoleIdStr ? parseInt(filterRoleIdStr) : undefined

      return UsersAdminService.getAll(token!, {
        page,
        pageSize,
        search: urlSearch || undefined,
        role_id
      })
    }
  })

  const filterRoleIdStr = getFilter('role')
  const filterRoleId = filterRoleIdStr ? parseInt(filterRoleIdStr) : null

  // Cargar roles (una sola vez)
  useEffect(() => {
    if (!token) return
    AdminService.getRoles(token).then(res => {
      if (!res.error && res.data) setRoles(res.data)
    })
  }, [token])

  const handleEditRole = (user: User) => {
    setSelectedUser(user)
    openEditModal()
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    openDeleteModal()
  }

  const handleRoleUpdated = (updated: User) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
  }

  const handleConfirmDelete = async () => {
    if (!token || !selectedUser) return

    setIsDeleteLoading(true)

    try {
      const response = await UsersAdminService.remove(token, selectedUser.id)

      if (response.error) {
        toast.error(response.error)

        return
      }

      const displayName =
        selectedUser.name && selectedUser.surname
          ? `${selectedUser.name} ${selectedUser.surname}`
          : (selectedUser.name ?? selectedUser.email)

      toast.success(`Usuario ${displayName} eliminado`)
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setTotal(prev => prev - 1)

      if (users.length - 1 === 0 && page > 1) setPage(page - 1)

      closeDelete()
    } catch {
      toast.error('No se pudo conectar con el servidor.')
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const deleteDisplayName = selectedUser
    ? selectedUser.name && selectedUser.surname
      ? `${selectedUser.name} ${selectedUser.surname}`
      : (selectedUser.name ?? selectedUser.email)
    : ''

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

      <ConfirmActionModal
        isOpen={isDeleteOpen}
        loading={isDeleteLoading}
        name={deleteDisplayName}
        onClose={() => {
          if (!isDeleteLoading) closeDelete()
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar usuario"
        type="delete"
      />
    </section>
  )
}
