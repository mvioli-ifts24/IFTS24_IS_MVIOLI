import { SearchInput } from '../../atoms/inputs/SearchInput'

import { type FilterGroup, TableFilters } from './TableFilters'

export interface SearchFilterBarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchLabel?: string
  searchId?: string
  filters?: FilterGroup[]
}

/**
 * Barra compuesta de búsqueda + filtros.
 * Cada parte es opcional: si no se pasa onSearchChange no renderiza SearchInput,
 * si no se pasan filters no renderiza TableFilters.
 */
export function SearchFilterBar({
  search = '',
  onSearchChange,
  searchLabel = 'Buscar',
  searchId = 'table-search',
  filters
}: SearchFilterBarProps) {
  const hasSearch = !!onSearchChange
  const hasFilters = !!filters?.length

  if (!hasSearch && !hasFilters) return null

  return (
    <div className="flex items-center justify-between gap-4">
      {hasSearch && (
        <div className="w-full max-w-2xs">
          <SearchInput
            id={searchId}
            label={searchLabel}
            onChange={onSearchChange!}
            value={search}
          />
        </div>
      )}
      {hasFilters && <TableFilters groups={filters!} />}
    </div>
  )
}
