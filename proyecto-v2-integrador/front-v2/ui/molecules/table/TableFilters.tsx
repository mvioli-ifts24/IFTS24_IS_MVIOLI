'use client'

import { FunnelIcon, XIcon } from '@phosphor-icons/react'
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'

import { Button } from '../../atoms/Button'
import { StarRating } from '../../atoms/StarRating'
import { Text } from '../../atoms/Text'
import { DropdownMenu } from '../DropdownMenu'

export interface FilterOption {
  value: string | number
  label: string
}

export interface FilterGroup {
  id: string
  label: string
  /**
   * Opciones de texto para el tipo 'default'.
   * No se usa cuando type es 'star-rating'.
   */
  options?: FilterOption[]
  value: string | number
  defaultValue?: string | number
  onChange: (value: string | number) => void
  /**
   * Tipo de selector.
   * - 'default': lista de botones de texto
   * - 'star-rating': selector de estrellas de 1 a 5
   * @default 'default'
   */
  type?: 'default' | 'star-rating'
}

export interface TableFiltersProps {
  groups: FilterGroup[]
  /** Etiqueta del botón de filtros.
   * @default 'Filtros'
   */
  label?: string
}

export function TableFilters({ groups, label = 'Filtros' }: TableFiltersProps) {
  const hasActiveFilter = groups.some(g => g.value !== (g.defaultValue ?? g.options?.[0]?.value))

  const trigger = (
    <div className="relative">
      <Button color="muted" iconLeft={FunnelIcon} iconRight={CaretDownIcon} variant="outlined">
        {label}
      </Button>
      {hasActiveFilter && (
        <div className="bg-danger-400 absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full" />
      )}
    </div>
  )

  return (
    <DropdownMenu align="right" trigger={trigger}>
      <div className="flex flex-col gap-1 p-1">
        {groups.map((group, i) => (
          <div key={group.id}>
            {i > 0 && <div className="my-1 border-t border-neutral-100/20" />}
            <Text
              className="px-1 pt-1 pb-2 tracking-wide uppercase"
              color="muted"
              size="xs"
              weight="semibold"
            >
              {group.label}
            </Text>

            {group.type === 'star-rating' ? (
              <div className="flex justify-center px-1 pb-1">
                <StarRating
                  onChange={v => {
                    const defaultVal = group.defaultValue ?? 0

                    group.onChange(v === Number(group.value) ? (defaultVal as string | number) : v)
                  }}
                  showLabel={false}
                  size={24}
                  value={Number(group.value)}
                />
              </div>
            ) : (
              (group.options ?? []).map(opt => (
                <Button
                  key={opt.value}
                  fullWidth
                  className={
                    group.value === opt.value ? 'bg-primary-50 justify-between!' : 'justify-start'
                  }
                  color={group.value === opt.value ? 'primary' : 'muted'}
                  iconRight={group.value === opt.value ? XIcon : undefined}
                  onClick={() => {
                    const defaultVal = group.defaultValue ?? group.options?.[0]?.value

                    group.onChange(
                      group.value === opt.value ? (defaultVal as string | number) : opt.value
                    )
                  }}
                  variant="text"
                >
                  {opt.label}
                </Button>
              ))
            )}
          </div>
        ))}
      </div>
    </DropdownMenu>
  )
}
