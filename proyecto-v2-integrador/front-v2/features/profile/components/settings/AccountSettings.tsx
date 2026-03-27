'use client'

import { GearIcon, KeyIcon } from '@phosphor-icons/react'

import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { Button, CardWrapper, Heading } from '@/ui'

import { useProfileStore } from '../../store/profile.store'

import { PasswordModal } from './PasswordModal'
import { PreferencesModal } from './PreferencesModal'

export function AccountSettings() {
  const loading = useProfileStore(state => state.loading)
  const { open: openPassword } = useModal(MODAL_IDS.CHANGE_PASSWORD)
  const { open: openPreferences } = useModal(MODAL_IDS.EDIT_PREFERENCES)

  return (
    <>
      <CardWrapper
        className="mx-auto flex w-full max-w-5xl flex-col gap-4"
        elevation="0"
        loading={loading}
      >
        <Heading level="h3" size="xs" variant="primary">
          Configuración de la cuenta
        </Heading>
        <div className="flex flex-col gap-2">
          <Button
            className="w-fit"
            color="muted"
            iconLeft={KeyIcon}
            onClick={openPassword}
            size="sm"
            type="button"
            variant="text"
          >
            Cambiar contraseña
          </Button>
          <Button
            className="w-fit"
            color="muted"
            iconLeft={GearIcon}
            onClick={openPreferences}
            size="sm"
            type="button"
            variant="text"
          >
            Preferencias
          </Button>
        </div>
      </CardWrapper>

      {/* Los modales manejan su propia visibilidad internamente */}
      <PasswordModal />
      <PreferencesModal />
    </>
  )
}
