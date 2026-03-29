'use client'

import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'

import { type Banner } from '@/features/shared/types/media.types'
import { type ColumnDef, SearchFiltersTable, type TableActionDef, Text } from '@/ui'

export interface BannersTableProps {
  banners: Banner[]
  onEdit: (banner: Banner) => void
  onDelete: (banner: Banner) => void
  search?: string
  onSearchChange?: (value: string) => void
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  loading?: boolean
}

export function BannersTable({
  banners,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  loading
}: BannersTableProps) {
  const columns: ColumnDef<Banner>[] = [
    {
      id: 'image',
      header: 'Imagen',
      width: '100px',
      cell: banner => (
        <div className="flex items-center gap-1.5">
          {banner.image_url_horizontal && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`${banner.name} horizontal`}
              className="h-8 w-14 rounded object-cover"
              src={banner.image_url_horizontal}
              title="Horizontal"
            />
          )}
          {banner.image_url_vertical && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`${banner.name} vertical`}
              className="h-10 w-6 rounded object-cover"
              src={banner.image_url_vertical}
              title="Vertical"
            />
          )}
        </div>
      )
    },
    {
      id: 'name',
      header: 'Nombre'
    },
    {
      id: 'link',
      header: 'Enlace',
      cell: banner =>
        banner.link ? (
          <a
            className="text-primary text-sm underline underline-offset-2"
            href={banner.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {banner.link}
          </a>
        ) : (
          <Text color="muted" size="sm">
            —
          </Text>
        )
    },
    {
      id: 'contact',
      header: 'Contacto',
      cell: banner => (
        <Text color="muted" size="sm">
          {banner.contact ?? '—'}
        </Text>
      )
    }
  ]

  const actions: TableActionDef<Banner>[] = [
    {
      icon: PencilSimpleIcon,
      label: 'Editar',
      onClick: onEdit
    },
    {
      icon: TrashIcon,
      label: 'Eliminar',
      color: 'danger',
      onClick: onDelete
    }
  ]

  return (
    <SearchFiltersTable
      actions={actions}
      columns={columns}
      data={banners}
      emptyMessage="No hay banners cargados todavía."
      keyExtractor={banner => banner.id}
      loading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onSearchChange={onSearchChange}
      page={page}
      pageSize={pageSize}
      search={search}
      searchId="banners-search"
      total={total}
    />
  )
}
