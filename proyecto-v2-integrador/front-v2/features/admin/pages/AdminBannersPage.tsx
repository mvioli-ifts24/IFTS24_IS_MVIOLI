'use client'

import { PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useModal } from '@/features/shared/store/modals.store'
import { type Banner } from '@/features/shared/types/media.types'
import { Button, CardWrapper, ConfirmActionModal } from '@/ui'

import { BannerFormModal } from '../components/banners/BannerFormModal'
import { BannersTable } from '../components/banners/BannersTable'
import { useAdminCrud } from '../hooks/useAdminCrud'
import { BannersAdminService } from '../services/banners.service'

export function AdminBannersPage() {
  const { token } = useAuthStore()
  const { isOpen: isFormOpen, open: openFormModal } = useModal(MODAL_IDS.ADMIN_BANNER_FORM)
  const {
    isOpen: isDeleteOpen,
    open: openDeleteModal,
    close: closeDelete
  } = useModal(MODAL_IDS.ADMIN_BANNER_DELETE)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const {
    items: banners,
    initialLoading,
    selected: selectedBanner,
    setSelected: setSelectedBanner,
    total,
    tableParams: { search, page, pageSize, setSearch, setPage, setPageSize },
    refetch
  } = useAdminCrud<Banner>({
    token,
    fetchFn: ({ page, pageSize, urlSearch }) =>
      BannersAdminService.getAll(token!, { page, pageSize, search: urlSearch || undefined })
  })

  const handleCreate = () => {
    setSelectedBanner(null)
    openFormModal()
  }

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner)
    openFormModal()
  }

  const handleDelete = (banner: Banner) => {
    setSelectedBanner(banner)
    openDeleteModal()
  }

  const handleConfirmDelete = async () => {
    if (!token || !selectedBanner) return

    setIsDeleteLoading(true)

    try {
      const response = await BannersAdminService.remove(token, selectedBanner.id)

      if (response.error) {
        toast.error(response.error)

        return
      }

      toast.success(`Banner "${selectedBanner.name}" eliminado`)

      if (banners.length - 1 === 0 && page > 1) setPage(page - 1)
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
        <BannersTable
          banners={banners}
          loading={initialLoading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSearchChange={setSearch}
          page={page}
          pageSize={pageSize}
          search={search}
          total={total}
        />

        <Button className="w-fit" iconLeft={PlusIcon} onClick={handleCreate} size="sm">
          Nuevo banner
        </Button>
      </CardWrapper>

      {isFormOpen && <BannerFormModal banner={selectedBanner} onSuccess={refetch} />}

      <ConfirmActionModal
        isOpen={isDeleteOpen}
        loading={isDeleteLoading}
        name={selectedBanner?.name}
        onClose={() => {
          if (!isDeleteLoading) closeDelete()
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar banner"
        type="delete"
      />
    </section>
  )
}
