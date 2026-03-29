'use client'

import { useEffect, useState } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { SponsorsService } from '@/features/shared/services/sponsors.service'
import { type Sponsor } from '@/features/shared/types/media.types'
import { LogoLoop, type LogoImageItem } from '@/ui'

export function SponsorsBanner() {
  const token = useAuthStore(state => state.token)
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  /* Carga los sponsors una sola vez al montar */
  useEffect(() => {
    if (!token) return
    SponsorsService.getAll(token).then(res => {
      if (res.data) setSponsors(res.data)
    })
  }, [token])

  if (sponsors.length === 0) return null

  const logos: LogoImageItem[] = sponsors.map(s => ({
    alt: s.name,
    href: s.link ?? undefined,
    src: s.image_url
  }))

  return (
    <div className="pt-4">
      <LogoLoop
        fadeOut
        invertOnDark
        scaleOnHover
        ariaLabel="Sponsors de la plataforma"
        fadeOutColor="var(--background)"
        gap={56}
        hoverSpeed={15}
        logoHeight={24}
        logos={logos}
        speed={45}
      />
    </div>
  )
}
