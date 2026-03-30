'use client'

import { PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type Sponsor } from '@/features/shared/types/media.types'
import { Button, CardWrapper, ConfirmActionModal } from '@/ui'

import { SponsorFormModal } from '../components/sponsors/SponsorFormModal'
import { SponsorsTable } from '../components/sponsors/SponsorsTable'
import { useAdminCrud } from '../hooks/useAdminCrud'
import { SponsorsAdminService } from '../services/sponsors.service'

export function AdminSponsorsPage() {
  const { token } = useAuthStore()
  const { isOpen: isFormOpen, open: openFormModal } = useModal(MODAL_IDS.ADMIN_SPONSOR_FORM)
  const {
    isOpen: isDeleteOpen,
    open: openDeleteModal,
    close: closeDelete
  } = useModal(MODAL_IDS.ADMIN_SPONSOR_DELETE)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const {
    items: sponsors,
    initialLoading,
    selected: selectedSponsor,
    setSelected: setSelectedSponsor,
    total,
    tableParams: { search, page, pageSize, setSearch, setPage, setPageSize },
    refetch
  } = useAdminCrud<Sponsor>({
    token,
    fetchFn: ({ page, pageSize, urlSearch }) =>
      SponsorsAdminService.getAll(token!, { page, pageSize, search: urlSearch || undefined })
  })

  const handleCreate = () => {
    setSelectedSponsor(null)
    openFormModal()
  }

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    openFormModal()
  }

  const handleDelete = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    openDeleteModal()
  }

  const handleConfirmDelete = async () => {
    if (!token || !selectedSponsor) return

    setIsDeleteLoading(true)

    try {
      const response = await SponsorsAdminService.remove(token, selectedSponsor.id)

      if (response.error) {
        toast.error(response.error)

        return
      }

      toast.success(`Sponsor "${selectedSponsor.name}" eliminado`)

      if (sponsors.length - 1 === 0 && page > 1) setPage(page - 1)
      else refetch()

      closeDelete()
    } catch {
      toast.error('No se pudo conectar con el servidor.')
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <CardWrapper className="flex flex-col gap-8" elevation="0">
        <SponsorsTable
          loading={initialLoading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSearchChange={setSearch}
          page={page}
          pageSize={pageSize}
          search={search}
          sponsors={sponsors}
          total={total}
        />

        <Button className="w-fit" iconLeft={PlusIcon} onClick={handleCreate} size="sm">
          Nuevo sponsor
        </Button>
      </CardWrapper>

      {isFormOpen && <SponsorFormModal onSuccess={refetch} sponsor={selectedSponsor} />}

      <ConfirmActionModal
        isOpen={isDeleteOpen}
        loading={isDeleteLoading}
        name={selectedSponsor?.name}
        onClose={() => {
          if (!isDeleteLoading) closeDelete()
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar sponsor"
        type="delete"
      />
    </section>
  )
}
