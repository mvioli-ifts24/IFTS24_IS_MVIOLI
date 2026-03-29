'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

export interface UseTableQueryParamsOptions {
  defaultPageSize?: number
  debounceMs?: number
}

/**
 * Hook agnóstico para sincronizar búsqueda, filtros y paginación con la URL.
 *
 * Parámetros de URL generados:
 * - `search`          → texto de búsqueda
 * - `filter_{key}`    → valor de cada filtro (ej: filter_role=2)
 * - `page`            → página actual (1-based)
 * - `pageSize`        → cantidad de filas por página
 *
 * El campo `search` usa debounce para no spamear la URL en cada tecla;
 * el valor ya estabilizado se expone en `urlSearch` y es el que se usa
 * para llamadas a la API o filtros client-side.
 */
export function useTableQueryParams({
  defaultPageSize = 5,
  debounceMs = 400
}: UseTableQueryParamsOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ── Valores estabilizados desde URL ──────────────────────────────────────
  const urlSearch = searchParams.get('search') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const pageSize = Math.max(1, Number(searchParams.get('pageSize') ?? String(defaultPageSize)))

  // ── Estado local para el input de búsqueda (responde en cada tecla) ──────
  // Se inicializa desde la URL para preservar el valor en recargas o navegaciones.
  const [search, setSearchState] = useState(urlSearch)

  // ── Helpers de navegación ─────────────────────────────────────────────────
  const buildParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      return params
    },
    [searchParams]
  )

  const push = useCallback(
    (params: URLSearchParams) => {
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname]
  )

  // ── Setters ───────────────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value)

      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(() => {
        push(buildParams({ search: value || null, page: '1' }))
      }, debounceMs)
    },
    [buildParams, push, debounceMs]
  )

  /**
   * Lee el valor de un filtro desde la URL.
   * Retorna `null` si no está presente.
   * Clave → `filter_{key}` en la URL.
   */
  const getFilter = useCallback(
    (key: string): string | null => searchParams.get(`filter_${key}`),
    [searchParams]
  )

  /**
   * Escribe un filtro en la URL y resetea la paginación a la página 1.
   * Pasar `null` elimina el filtro de la URL.
   */
  const setFilter = useCallback(
    (key: string, value: string | null) => {
      push(buildParams({ [`filter_${key}`]: value, page: '1' }))
    },
    [buildParams, push]
  )

  const setPage = useCallback(
    (newPage: number) => {
      push(buildParams({ page: String(newPage) }))
    },
    [buildParams, push]
  )

  const setPageSize = useCallback(
    (newSize: number) => {
      push(buildParams({ pageSize: String(newSize), page: '1' }))
    },
    [buildParams, push]
  )

  return {
    /** Valor actual del input de búsqueda (para el campo controlado) */
    search,
    /** Valor estabilizado desde la URL — usar para API calls o filtros */
    urlSearch,
    page,
    pageSize,
    getFilter,
    setSearch,
    setFilter,
    setPage,
    setPageSize
  }
}
