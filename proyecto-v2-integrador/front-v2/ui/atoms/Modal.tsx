'use client'
import { XIcon } from '@phosphor-icons/react'
import { FocusTrap } from 'focus-trap-react'
import { ReactNode, useEffect } from 'react'

import { Button } from './Button'
import { Heading } from './Heading'
import { Separator } from './Separator'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  closeDisabled?: boolean
  closeOnEscape?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeDisabled = false,
  closeOnEscape = true
}: ModalProps) {
  const handleClose = () => {
    if (closeDisabled) return
    onClose()
  }

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      event.stopPropagation()

      if (closeDisabled) return

      onClose()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeOnEscape, closeDisabled, onClose])

  if (!isOpen) return null

  return (
    <FocusTrap
      focusTrapOptions={{
        clickOutsideDeactivates: false,
        escapeDeactivates: false,
        fallbackFocus: '#modal-content',
        preventScroll: true
      }}
    >
      <div className="absolute">
        <div aria-hidden="true" className="fixed inset-0 z-40 bg-black/50 transition-opacity" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            aria-modal="true"
            className="bg-surface relative w-full max-w-md rounded-xl border border-neutral-200 shadow-lg"
            id="modal-content"
            role="dialog"
          >
            <div className="flex items-center justify-between p-4">
              <Heading level="h2" size="xs" variant="primary">
                {title}
              </Heading>
              <Button
                disabled={closeDisabled}
                iconLeft={XIcon}
                onClick={handleClose}
                size="sm"
                variant="text"
              />
            </div>
            <Separator />
            <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
          </div>
        </div>
      </div>
    </FocusTrap>
  )
}
