'use client'

import { PlusIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useTableQueryParams } from '@/features/shared/hooks/useTableQueryParams'
import { useModal } from '@/features/shared/store/modals.store'
import { type Banner } from '@/features/shared/types/media.types'
import { Button, CardWrapper } from '@/ui'

import { BannerFormModal } from '../components/banners/BannerFormModal'
import { BannersTable } from '../components/banners/BannersTable'
import { DeleteBannerModal } from '../components/banners/DeleteBannerModal'
import { BannersAdminService } from '../services/banners.service'

export function AdminBannersPage() {
  const { token } = useAuthStore()
  const [banners, setBanners] = useState<Banner[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [total, setTotal] = useState(0)

  // URL query params — búsqueda y paginación sincronizadas con la URL
  const { search, urlSearch, page, pageSize, setSearch, setPage, setPageSize } =
    useTableQueryParams({ defaultPageSize: 5 })

  const { open: openFormModal } = useModal(MODAL_IDS.ADMIN_BANNER_FORM)
  const { open: openDeleteModal } = useModal(MODAL_IDS.ADMIN_BANNER_DELETE)

  const fetchBanners = useCallback(async () => {
    if (!token) return

    try {
      const response = await BannersAdminService.getAll(token, {
        page,
        pageSize,
        search: urlSearch || undefined
      })

      if (response.error) {
        toast.error(response.error)
      } else {
        setBanners(response.data ?? [])
        setTotal(response.total ?? 0)
      }
    } catch {
      toast.error('No se pudo conectar con el servidor.')
    } finally {
      setInitialLoading(false)
    }
  }, [token, page, pageSize, urlSearch])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const handleCreate = () => {
    setSelectedBanner(null)
    setFormKey(k => k + 1)
    openFormModal()
  }

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner)
    setFormKey(k => k + 1)
    openFormModal()
  }

  const handleDelete = (banner: Banner) => {
    setSelectedBanner(banner)
    openDeleteModal()
  }

  const handleSaved = (saved: Banner) => {
    fetchBanners()
  }

  const handleDeleted = (bannerId: number) => {
    const remainingOnPage = banners.length - 1

    if (remainingOnPage === 0 && page > 1) {
      setPage(page - 1)
    } else {
      fetchBanners()
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

      <BannerFormModal key={formKey} banner={selectedBanner} onSuccess={handleSaved} />
      <DeleteBannerModal banner={selectedBanner} onSuccess={handleDeleted} />
    </section>
  )
}
