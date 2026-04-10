'use client'

import { useEffect, useState } from 'react'

import { PublicService } from '@/features/shared/services/public.service'
import { type Sponsor } from '@/features/shared/types/media.types'
import { LogoLoop, Skeleton, type LogoImageItem } from '@/ui'

export function SponsorsBanner() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    PublicService.getSponsors().then(res => {
      if (res.data) setSponsors(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Skeleton className="h-10 w-full" />

  if (sponsors.length === 0) return null

  const logos: LogoImageItem[] = sponsors.map(s => ({
    alt: s.name,
    href: s.link ?? undefined,
    src: s.image_url
  }))

  return (
    <div className="p-2">
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
        speed={35}
      />
    </div>
  )
}
