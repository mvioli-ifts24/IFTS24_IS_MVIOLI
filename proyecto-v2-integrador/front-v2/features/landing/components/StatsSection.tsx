'use client'

import { GameControllerIcon, StarIcon, UsersIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import { PublicService, type PublicStats } from '@/features/shared/services/public.service'
import { StatCard, Text } from '@/ui'

// ── Stats Section ──────────────────────────────────────────────────────────

interface StatsSectionProps {
  /** Si se pasan stats precargadas (SSR), no hace fetch cliente */
  initialStats?: PublicStats | null
}

export function StatsSection({ initialStats }: StatsSectionProps) {
  const [stats, setStats] = useState<PublicStats | null>(initialStats ?? null)

  useEffect(() => {
    if (initialStats) return

    PublicService.getStats().then(res => {
      if (res.data) setStats(res.data)
    })
  }, [initialStats])

  return (
    <section className="w-full max-w-6xl px-6 py-20 lg:px-16" id="stats">
      <div className="mb-12 text-center">
        <Text color="muted" size="lg" variant="label">
          El impacto de nuestra comunidad
        </Text>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <StatCard animated accent={1} icon={UsersIcon} label="Miembros" value={stats?.users ?? 0} />
        <StatCard animated accent={3} icon={StarIcon} label="Reseñas" value={stats?.reviews ?? 0} />
        <StatCard
          animated
          accent={2}
          icon={GameControllerIcon}
          label="Juegos catalogados"
          value={stats?.games ?? 0}
        />
      </div>
    </section>
  )
}
