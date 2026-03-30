'use client'

import { DotsThreeVerticalIcon, type Icon } from '@phosphor-icons/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import { Button } from '../atoms/Button'
import { CardWrapper } from '../atoms/CardWrapper'

export interface DropdownMenuItemDef {
  /**
   * Etiqueta visible del item
   */
  label: string
  /**
   * Ícono opcional a la izquierda del label
   */
  icon?: Icon
  /**
   * Callback al hacer click en el item
   */
  onClick: () => void
  /**
   * Variante visual: 'danger' para acciones destructivas/sensibles
   * @default 'default'
   */
  variant?: 'default' | 'danger'
}

export interface DropdownMenuProps {
  /**
   * Lista de items a renderizar en el menú.
   * Solo se usa cuando no se pasa `children`.
   */
  items?: DropdownMenuItemDef[]
  /**
   * Alineación del panel desplegable
   * @default 'right'
   */
  align?: 'left' | 'right'
  /**
   * Label accesible para el botón de trigger por defecto.
   * @default 'Opciones'
   */
  triggerLabel?: string
  /**
   * Trigger personalizado. Si se pasa, reemplaza el botón de tres puntos por defecto.
   */
  trigger?: ReactNode
  /**
   * Contenido personalizado del panel. Si se pasa, reemplaza la lista de items.
   */
  children?: ReactNode
}

export function DropdownMenu({
  align = 'right',
  children,
  items,
  trigger,
  triggerLabel = 'Opciones'
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  return (
    <div ref={ref} className="relative shrink-0">
      <div
        onClick={e => {
          e.stopPropagation()
          setOpen(v => !v)
        }}
      >
        {trigger ?? (
          <Button
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label={triggerLabel}
            color="muted"
            iconLeft={DotsThreeVerticalIcon}
            size="sm"
            variant="text"
          />
        )}
      </div>

      {open && (
        <CardWrapper
          className={[
            'absolute! top-full z-50 mt-2 min-w-44 p-1!',
            align === 'right' ? 'right-0' : 'left-0'
          ].join(' ')}
          elevation="3"
        >
          {children ?? (
            <div className="flex flex-col gap-1" role="menu">
              {(items ?? []).map(item => (
                <Button
                  key={item.label}
                  fullWidth
                  className="justify-start"
                  color={item.variant === 'danger' ? 'danger' : 'muted'}
                  iconLeft={item.icon}
                  onClick={e => {
                    e.stopPropagation()
                    setOpen(false)
                    item.onClick()
                  }}
                  role="menuitem"
                  size="xs"
                  variant="text"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </CardWrapper>
      )}
    </div>
  )
}
