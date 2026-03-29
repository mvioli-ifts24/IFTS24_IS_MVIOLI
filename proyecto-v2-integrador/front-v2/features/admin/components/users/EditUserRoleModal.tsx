'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type User, type UserRoleOption } from '@/features/shared/types/user.types'
import { Button, ConfirmActionModal, Modal, Select } from '@/ui'

import { editUserRoleSchema, type EditUserRoleFormData } from '../../schemas/edit-user-role.schema'
import { UsersAdminService } from '../../services/users.service'

export interface EditUserRoleModalProps {
  user: User | null
  roles: UserRoleOption[]
  onSuccess: (updated: User) => void
}

export function EditUserRoleModal({ user, roles, onSuccess }: EditUserRoleModalProps) {
  const { token } = useAuthStore()
  const { isOpen, close } = useModal(MODAL_IDS.ADMIN_EDIT_USER_ROLE)
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const form = useForm<EditUserRoleFormData>({
    resolver: zodResolver(editUserRoleSchema)
  })

  // Sincronizar el select con el rol actual del usuario cuando se abre
  useEffect(() => {
    if (!user || !roles.length) return

    const currentRole = roles.find(r => r.name === user.role)

    if (currentRole) form.reset({ role_id: currentRole.id })
  }, [user, roles, form])

  const handleClose = () => {
    if (isLoading) return
    close()
  }

  const handleSave = async () => {
    const valid = await form.trigger()

    if (!valid) return
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!token || !user) return

    const { role_id } = form.getValues()

    setIsLoading(true)

    const response = await UsersAdminService.updateRole(token, user.id, role_id)

    setIsLoading(false)

    if (response.error || !response.data) {
      toast.error(response.error ?? 'No se pudo actualizar el rol')
      setIsConfirmOpen(false)

      return
    }

    const roleName = roles.find(r => r.id === role_id)?.label ?? role_id

    toast.success(`Rol de ${user.name ?? user.email} actualizado a "${roleName}"`)
    onSuccess(response.data)
    setIsConfirmOpen(false)
    close()
  }

  const displayName = user
    ? user.name && user.surname
      ? `${user.name} ${user.surname}`
      : (user.name ?? user.email)
    : ''

  return (
    <>
      <Modal
        closeDisabled={isLoading}
        isOpen={isOpen}
        onClose={handleClose}
        size="lg"
        title="Editar usuario"
      >
        <div className="flex flex-col gap-4">
          <Select
            disabled={isLoading}
            id="edit-user-role-select"
            label="Rol"
            state={form.formState.errors.role_id ? 'error' : 'default'}
            {...form.register('role_id', { valueAsNumber: true })}
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </Select>

          <div className="flex justify-end">
            <Button disabled={!form.formState.isValid} loading={isLoading} onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmActionModal
        confirmColor="primary"
        confirmWord="editar"
        description={`Estás por realizar cambios permanentes en el sistema. Esta acción modificará los permisos de ${displayName}.`}
        isOpen={isConfirmOpen}
        loading={isLoading}
        onClose={() => {
          if (!isLoading) setIsConfirmOpen(false)
        }}
        onConfirm={handleConfirm}
        title="Mensaje de seguridad"
      />
    </>
  )
}
