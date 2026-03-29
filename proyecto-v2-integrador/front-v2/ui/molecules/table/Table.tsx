'use client'

import { type Icon } from '@phosphor-icons/react'
import { type ReactNode } from 'react'

import { type ButtonColor } from '@/ui/atoms/Button'

import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'

// ─────────────────────────────────────────────
// Tipos públicos
// ─────────────────────────────────────────────

/**
 * Definición de una columna de la tabla.
 *
 * `cell` puede ser:
 * - Omitido → usa `id` como accessor y renderiza con `<Text size="sm" weight="medium">`
 * - Una función `(row) => ReactNode` → render personalizado
 */
export interface ColumnDef<TRow> {
  id: string
  header: string
  cell?: (row: TRow) => ReactNode
  /** Ancho fijo para la columna (ej: '200px', '30%') */
  width?: string
}

/**
 * Definición de una acción en la columna de acciones (siempre fija/sticky a la derecha).
 */
export interface TableActionDef<TRow> {
  icon: Icon
  label?: string
  color?: ButtonColor
  onClick: (row: TRow) => void
  /** Función que recibe la fila y devuelve si la acción debe estar deshabilitada */
  disabled?: (row: TRow) => boolean
}

export interface TableProps<TRow> {
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
  /** Cantidad de filas por página (se usa para calcular el número de skeletons). */
  pageSize: number
  /** Mensaje cuando no hay filas */
  emptyMessage?: string
  /**
   * Muestra filas skeleton de carga. Se usan tantas filas como `pageSize` (máximo 10).
   */
  loading?: boolean
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

export function Table<TRow>({
  columns,
  data,
  keyExtractor,
  actions,
  pageSize,
  emptyMessage = 'No se encontraron resultados.',
  loading = false
}: TableProps<TRow>) {
  const hasActions = !!actions?.length
  const colSpan = columns.length + (hasActions ? 1 : 0)
  const skeletonRows = Math.min(pageSize, 10)

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full min-w-max text-left text-sm">
        <TableHeader columns={columns} hasActions={hasActions} />
        <TableBody
          actions={actions}
          colSpan={colSpan}
          columns={columns}
          data={data}
          emptyMessage={emptyMessage}
          keyExtractor={keyExtractor}
          loading={loading}
          skeletonRows={skeletonRows}
        />
      </table>
    </div>
  )
}
