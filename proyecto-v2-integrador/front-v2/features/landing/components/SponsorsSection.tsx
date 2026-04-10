'use client'

import { useEffect, useState } from 'react'

import { PublicService } from '@/features/shared/services/public.service'
import { type Sponsor } from '@/features/shared/types/media.types'
import { LogoLoop, Text, type LogoItem } from '@/ui'

// ── Sponsors Section ───────────────────────────────────────────────────────

export function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    PublicService.getSponsors().then(res => {
      if (res.data) setSponsors(res.data)
    })
  }, [])

  if (sponsors.length === 0) return null

  const logos: LogoItem[] = sponsors.map(s => ({
    src: s.image_url,
    alt: s.name,
    href: s.link ?? undefined
  }))

  return (
    <section className="w-full max-w-6xl px-6 py-16 lg:px-16" id="sponsors">
      <div className="mb-10 text-center">
        <Text color="muted" size="lg" variant="label">
          Marcas que apoyan a nuestra comunidad
        </Text>
      </div>

      <LogoLoop
        fadeOut
        invertOnDark
        scaleOnHover
        ariaLabel="Carrusel de sponsors"
        fadeOutColor="var(--background)"
        gap={64}
        hoverSpeed={10}
        logoHeight={44}
        logos={logos}
        speed={30}
      />
    </section>
  )
}
