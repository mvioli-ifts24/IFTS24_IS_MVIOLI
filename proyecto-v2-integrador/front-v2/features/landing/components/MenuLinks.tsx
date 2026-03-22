'use client'

import { Button } from '@/ui'

import { NavLink } from './Navbar'

interface MenuLinksProps {
  links: NavLink[]
  onClose: () => void
}

export function MenuLinks({ links, onClose }: MenuLinksProps) {
  return (
    <>
      {links.map(link => (
        <Button
          key={link.href}
          color={link.color}
          href={link.href}
          iconLeft={link.icons}
          onClick={onClose}
          variant={link.variant}
        >
          <p>{link.label}</p>
        </Button>
      ))}
    </>
  )
}
