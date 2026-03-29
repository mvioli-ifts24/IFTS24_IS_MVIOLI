'use client'

import type { ColumnDef, TableActionDef } from './Table'

import { type ReactNode } from 'react'

import { Button } from '@/ui/atoms/Button'
import { Text } from '@/ui/atoms/Text'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'

// ─────────────────────────────────────────────
// Helper interno de render de celda
// ─────────────────────────────────────────────

function renderCell<TRow>(col: ColumnDef<TRow>, row: TRow): ReactNode {
  if (typeof col.cell === 'function') {
    return col.cell(row)
  }

  const value = row[col.id as keyof TRow]
  const text = value === null || value === undefined ? '—' : String(value)

  return (
    <Text size="sm" weight="medium">
      {text}
    </Text>
  )
}

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface TableBodyProps<TRow> {
  columns: ColumnDef<TRow>[]
  data: TRow[]
  keyExtractor: (row: TRow) => string | number
  actions?: TableActionDef<TRow>[]
  loading?: boolean
  skeletonRows: number
  emptyMessage: string
  colSpan: number
}

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────

export function TableBody<TRow>({
  columns,
  data,
  keyExtractor,
  actions,
  loading = false,
  skeletonRows,
  emptyMessage,
  colSpan
}: TableBodyProps<TRow>) {
  const hasActions = !!actions?.length

  if (loading) {
    return (
      <tbody>
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <tr key={i} className="border-b border-neutral-100 bg-neutral-50">
            {columns.map(col => (
              <td key={col.id} className="px-4 py-3">
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
            {hasActions && (
              <td className="sticky right-0 z-10 w-px bg-neutral-50 px-4 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    )
  }

  return (
    <tbody>
      {data.length === 0 ? (
        <tr>
          <td className="px-4 py-8 text-center" colSpan={colSpan}>
            <Text color="muted" size="sm">
              {emptyMessage}
            </Text>
          </td>
        </tr>
      ) : (
        data.map(row => (
          <tr
            key={keyExtractor(row)}
            className="group border-b border-neutral-100 bg-neutral-50 transition-colors hover:bg-neutral-100"
          >
            {columns.map(col => (
              <td key={col.id} className="px-4 py-3">
                {renderCell(col, row)}
              </td>
            ))}

            {hasActions && (
              <td className="sticky right-0 z-10 w-px bg-neutral-50 px-4 py-3 whitespace-nowrap transition-colors group-hover:bg-neutral-100">
                <div className="flex items-center justify-center gap-1">
                  {actions!.map((action, i) => (
                    <Button
                      key={i}
                      color={action.color}
                      disabled={action.disabled?.(row) ?? false}
                      iconLeft={action.icon}
                      onClick={() => action.onClick(row)}
                      title={action.label}
                      variant="text"
                    />
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))
      )}
    </tbody>
  )
}
