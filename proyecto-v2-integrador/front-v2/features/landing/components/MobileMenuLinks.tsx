'use client'

import { Button } from '@/ui'

import { NavLink } from './Navbar'

interface MobileMenuLinksProps {
  links: NavLink[]
}

export function MobileMenuLinks({ links }: MobileMenuLinksProps) {
  const close = () => {
    const details = document.querySelector('details')

    if (details) details.open = false
  }

  return (
    <nav className="flex flex-col gap-1 p-3">
      {links.map(link => (
        <Button
          key={link.href}
          className="text-foreground hover:text-primary-400 block rounded-xl px-3 py-3 font-medium transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          color={link.color}
          href={link.href}
          iconLeft={link.icons}
          onClick={close}
          variant={link.variant}
        >
          {link.label}
        </Button>
      ))}
    </nav>
  )
}
