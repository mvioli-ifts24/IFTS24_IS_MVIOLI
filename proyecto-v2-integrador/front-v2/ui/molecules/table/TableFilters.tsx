'use client'

import { FunnelIcon, XIcon } from '@phosphor-icons/react'
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

import { Button } from '../../atoms/Button'
import { Text } from '../../atoms/Text'

export interface FilterOption {
  value: string | number
  label: string
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  value: string | number
  defaultValue?: string | number
  onChange: (value: string | number) => void
}

export interface TableFiltersProps {
  groups: FilterGroup[]
  /** Etiqueta del botón de filtros.
   * @default 'Filtros'
   */
  label?: string
}

export function TableFilters({ groups, label = 'Filtros' }: TableFiltersProps) {
  const [open, setOpen] = useState(false)

  const hasActiveFilter = groups.some(g => g.value !== (g.defaultValue ?? g.options[0]?.value))

  return (
    <div className="relative shrink-0">
      <Button
        color="muted"
        iconLeft={FunnelIcon}
        iconRight={CaretDownIcon}
        onClick={() => setOpen(o => !o)}
        variant="outlined"
      >
        {label}
      </Button>
      {hasActiveFilter && (
        <div className="bg-danger-400 absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full" />
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="bg-surface absolute right-0 z-20 mt-1 min-w-48 rounded-lg border border-neutral-200 py-2 shadow-md">
            {groups.map((group, i) => (
              <div key={group.id}>
                {i > 0 && <div className="my-1 border-t border-neutral-100" />}
                <div className="px-3 pt-2 pb-1">
                  <Text
                    className="tracking-wide uppercase"
                    color="muted"
                    size="xs"
                    weight="semibold"
                  >
                    {group.label}
                  </Text>
                </div>
                {group.options.map(opt => (
                  <Button
                    key={opt.value}
                    fullWidth
                    className={
                      group.value === opt.value ? 'bg-primary-50 justify-between!' : 'justify-start'
                    }
                    color={group.value === opt.value ? 'primary' : 'muted'}
                    iconRight={group.value === opt.value ? XIcon : undefined}
                    onClick={() => {
                      const defaultVal = group.defaultValue ?? group.options[0]?.value

                      group.onChange(
                        group.value === opt.value ? (defaultVal as string | number) : opt.value
                      )
                      setOpen(false)
                    }}
                    variant={'text'}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
