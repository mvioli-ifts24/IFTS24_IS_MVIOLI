'use client'

import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import Image from 'next/image'

import { type Sponsor } from '@/features/shared/types/media.types'
import { type ColumnDef, SearchFiltersTable, type TableActionDef } from '@/ui'
import { LinkCell } from '@/ui/molecules/table/table-cells'

export interface SponsorsTableProps {
  sponsors: Sponsor[]
  onEdit: (sponsor: Sponsor) => void
  onDelete: (sponsor: Sponsor) => void
  search?: string
  onSearchChange?: (value: string) => void
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  loading?: boolean
}

export function SponsorsTable({
  sponsors,
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
}: SponsorsTableProps) {
  const columns: ColumnDef<Sponsor>[] = [
    {
      id: 'image',
      header: 'Imagen',
      width: '80px',
      cell: sponsor => (
        <Image
          alt={sponsor.name}
          className="rounded object-contain dark:invert"
          height={40}
          src={sponsor.image_url}
          width={100}
        />
      )
    },
    {
      id: 'name',
      header: 'Nombre'
    },
    {
      id: 'link',
      header: 'Enlace',
      cell: sponsor => <LinkCell href={sponsor.link} />
    },
    {
      id: 'contact',
      header: 'Contacto'
    }
  ]

  const actions: TableActionDef<Sponsor>[] = [
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
      data={sponsors}
      emptyMessage="No hay sponsors cargados todavía."
      keyExtractor={sponsor => sponsor.id}
      loading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onSearchChange={onSearchChange}
      page={page}
      pageSize={pageSize}
      search={search}
      searchId="sponsors-search"
      total={total}
    />
  )
}
