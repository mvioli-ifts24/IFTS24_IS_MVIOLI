'use client'

import type { FilterGroup } from '../molecules/table/TableFilters'

import { Paginator } from '../molecules/table/Paginator'
import { SearchFilterBar } from '../molecules/table/SearchFilterBar'
import { ColumnDef, Table, TableActionDef } from '../molecules/table/Table'

// ─────────────────────────────────────────────
// Tipos públicos
// ─────────────────────────────────────────────

export interface SearchFiltersTableProps<TRow> {
  /** Definición de columnas */
  columns: ColumnDef<TRow>[]
  /** Datos de las filas */
  data: TRow[]
  /** Función para extraer una clave única por fila */
  keyExtractor: (row: TRow) => string | number
  /**
   * Acciones de la fila. Si se pasa este array aparece automáticamente
   * una columna "Acciones" fija a la derecha.
   */
  actions?: TableActionDef<TRow>[]

  // ── Search ──────────────────────────────────
  search?: string
  onSearchChange?: (value: string) => void
  searchLabel?: string
  searchId?: string

  // ── Filters ─────────────────────────────────
  filters?: FilterGroup[]

  // ── Pagination ──────────────────────────────
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void

  /** Mensaje cuando no hay filas */
  emptyMessage?: string
  /**
   * Muestra filas skeleton de carga. Se usan tantas filas como `pageSize` (máximo 10).
   * Oculta la barra de búsqueda/filtros y el paginador mientras carga.
   */
  loading?: boolean
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

export function SearchFiltersTable<TRow>({
  columns,
  data,
  keyExtractor,
  actions,
  search,
  onSearchChange,
  searchLabel,
  searchId,
  filters,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  emptyMessage = 'No se encontraron resultados.',
  loading = false
}: SearchFiltersTableProps<TRow>) {
  const skeletonRows = Math.min(pageSize, 10)

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de búsqueda + filtros */}
      <SearchFilterBar
        filters={filters}
        onSearchChange={onSearchChange}
        search={search}
        searchId={searchId}
        searchLabel={searchLabel}
      />

      <Table
        actions={actions}
        columns={columns}
        data={loading ? Array(skeletonRows).fill({} as TRow) : data}
        emptyMessage={emptyMessage}
        keyExtractor={keyExtractor}
        loading={loading}
        pageSize={pageSize}
      />

      <Paginator
        loading={loading}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </div>
  )
}
