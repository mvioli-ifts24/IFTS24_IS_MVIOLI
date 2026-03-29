'use client'

import { PlusIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { MODAL_IDS } from '@/features/shared/constants/modals.constants'
import { useTableQueryParams } from '@/features/shared/hooks/useTableQueryParams'
import { useModal } from '@/features/shared/store/modals.store'
import { type Sponsor } from '@/features/shared/types/media.types'
import { Button, CardWrapper } from '@/ui'

import { DeleteSponsorModal } from '../components/sponsors/DeleteSponsorModal'
import { SponsorFormModal } from '../components/sponsors/SponsorFormModal'
import { SponsorsTable } from '../components/sponsors/SponsorsTable'
import { SponsorsAdminService } from '../services/sponsors.service'

export function AdminSponsorsPage() {
  const { token } = useAuthStore()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [total, setTotal] = useState(0)

  // URL query params — búsqueda y paginación sincronizadas con la URL
  const { search, urlSearch, page, pageSize, setSearch, setPage, setPageSize } =
    useTableQueryParams({ defaultPageSize: 5 })

  const { open: openFormModal } = useModal(MODAL_IDS.ADMIN_SPONSOR_FORM)
  const { open: openDeleteModal } = useModal(MODAL_IDS.ADMIN_SPONSOR_DELETE)

  const fetchSponsors = useCallback(async () => {
    if (!token) return

    try {
      const response = await SponsorsAdminService.getAll(token, {
        page,
        pageSize,
        search: urlSearch || undefined
      })

      if (response.error) {
        toast.error(response.error)
      } else {
        setSponsors(response.data ?? [])
        setTotal(response.total ?? 0)
      }
    } catch {
      toast.error('No se pudo conectar con el servidor.')
    } finally {
      setInitialLoading(false)
    }
  }, [token, page, pageSize, urlSearch])

  useEffect(() => {
    fetchSponsors()
  }, [fetchSponsors])

  const handleCreate = () => {
    setSelectedSponsor(null)
    setFormKey(k => k + 1)
    openFormModal()
  }

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    setFormKey(k => k + 1)
    openFormModal()
  }

  const handleDelete = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    openDeleteModal()
  }

  const handleSaved = () => {
    fetchSponsors()
  }

  const handleDeleted = () => {
    const remainingOnPage = sponsors.length - 1

    if (remainingOnPage === 0 && page > 1) {
      setPage(page - 1)
    } else {
      fetchSponsors()
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

      <SponsorFormModal key={formKey} onSuccess={handleSaved} sponsor={selectedSponsor} />
      <DeleteSponsorModal onSuccess={handleDeleted} sponsor={selectedSponsor} />
    </section>
  )
}
