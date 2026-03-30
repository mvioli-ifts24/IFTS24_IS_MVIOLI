'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useTableQueryParams } from '@/features/shared/hooks/useTableQueryParams'
import { type PaginatedApiResponse } from '@/features/shared/types/api.types'

/**
 * Parámetros que el hook pasa a la función de fetch.
 * `getFilter` permite que el fetcher acceda a filtros de URL arbitrarios
 * (ej: role_id para usuarios) sin necesidad de capturarlos externamente.
 */
export type CrudFetchParams = {
  page: number
  pageSize: number
  urlSearch: string
  getFilter: (key: string) => string | null
}

export interface UseAdminCrudOptions<T> {
  token: string | null
  fetchFn: (params: CrudFetchParams) => Promise<PaginatedApiResponse<T>>
  defaultPageSize?: number
}

/**
 * Hook que encapsula el estado y el ciclo de fetch para las páginas CRUD de admin.
 * Los handlers específicos (handleCreate, handleEdit, handleDelete, etc.)
 * quedan en cada página — este hook no los asume.
 */
export function useAdminCrud<T>({ token, fetchFn, defaultPageSize = 5 }: UseAdminCrudOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [selected, setSelected] = useState<T | null>(null)
  const [total, setTotal] = useState(0)

  const tableParams = useTableQueryParams({ defaultPageSize })
  const { page, pageSize, urlSearch, getFilter } = tableParams

  const refetch = useCallback(async () => {
    if (!token) return

    try {
      const res = await fetchFn({ page, pageSize, urlSearch, getFilter })

      if (res.error) {
        toast.error(res.error)
      } else {
        setItems(res.data ?? [])
        setTotal(res.total ?? 0)
      }
    } catch {
      toast.error('No se pudo conectar con el servidor.')
    } finally {
      setInitialLoading(false)
    }
  }, [token, fetchFn, page, pageSize, urlSearch, getFilter])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    items,
    setItems,
    initialLoading,
    selected,
    setSelected,
    total,
    setTotal,
    tableParams,
    refetch
  }
}
