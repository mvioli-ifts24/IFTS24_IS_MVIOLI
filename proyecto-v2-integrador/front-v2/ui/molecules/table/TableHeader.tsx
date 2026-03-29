'use client'

import type { ColumnDef } from './Table'

import { Text } from '@/ui/atoms/Text'

export interface TableHeaderProps<TRow> {
  columns: ColumnDef<TRow>[]
  hasActions: boolean
}

export function TableHeader<TRow>({ columns, hasActions }: TableHeaderProps<TRow>) {
  return (
    <thead className="bg-primary-100 tracking-wide text-neutral-500">
      <tr>
        {columns.map(col => (
          <th
            key={col.id}
            className="px-4 py-3 whitespace-nowrap"
            style={col.width ? { width: col.width, minWidth: col.width } : undefined}
          >
            <Text color="muted" size="xs" weight="semibold">
              {col.header.toUpperCase()}
            </Text>
          </th>
        ))}
        {hasActions && (
          <th className="bg-primary-100 sticky right-0 z-10 w-px px-4 py-3 text-center whitespace-nowrap">
            <Text color="muted" size="xs" weight="semibold">
              ACCIONES
            </Text>
          </th>
        )}
      </tr>
    </thead>
  )
}
