'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'

import { Button } from '../../atoms/Button'
import { Text } from '../../atoms/Text'
import { Select } from '../../atoms/inputs/Select'
import { Skeleton } from '../../atoms/skeleton/Skeleton'

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 15, 20]

export interface PaginatorProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  loading?: boolean
}

export function Paginator({
  page,
  pageSize,
  total,
  loading,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS
}: PaginatorProps) {
  const totalPages = Math.ceil(total / pageSize)

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const canPrev = page > 1
  const canNext = page < totalPages

  if (loading) {
    return (
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-36 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      {/* Filas por página */}
      <div className="flex w-fit items-center gap-2">
        <Text className="whitespace-nowrap" color="muted" size="sm">
          Filas por página
        </Text>

        <Select
          id="page-size-select"
          onChange={e => onPageSizeChange(Number(e.target.value))}
          options={pageSizeOptions.map(size => ({ label: String(size), value: size }))}
          size="xs"
          value={pageSize}
        />
      </div>

      {/* Botones Anterior / Siguiente */}
      <div className="flex items-center gap-2">
        {canPrev && (
          <Button
            color="muted"
            iconLeft={CaretLeftIcon}
            onClick={() => onPageChange(page - 1)}
            size="xs"
            variant="text"
          />
        )}
        {/* Contador X–Y de Z */}
        <Text color="muted" size="sm">
          {from}–{to} de {total}
        </Text>
        {canNext && (
          <Button
            color="muted"
            iconLeft={CaretRightIcon}
            onClick={() => onPageChange(page + 1)}
            size="xs"
            variant="text"
          />
        )}
      </div>
    </div>
  )
}
