'use client'

import {
  FolderOpenIcon,
  HashIcon,
  MedalIcon,
  ShieldIcon,
  StarIcon,
  TrophyIcon,
  UserCircleGearIcon,
  UsersIcon
} from '@phosphor-icons/react'
import { type ReactNode, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { ROUTES } from '@/features/shared/constants/nav.constants'
import { StatCard, type StatCardProps, Text } from '@/ui'

import { TopGamesList } from '../components/TopGamesList'
import { AdminService, type AdminStats, type TopGames } from '../services/admin.service'

type StatGroup = {
  section: string
  items: (Omit<StatCardProps, 'value'> & { key: keyof AdminStats })[]
}

const STAT_GROUPS: StatGroup[] = [
  {
    section: 'Plataforma',
    items: [
      {
        key: 'users',
        label: 'Usuarios activos',
        href: ROUTES.usuarios,
        icon: UsersIcon,
        accent: 3
      },
      {
        key: 'reviews',
        label: 'Reseñas totales',
        icon: StarIcon,
        accent: 2
      }
    ]
  },
  {
    section: 'Equipo con permisos',
    items: [
      {
        key: 'admins',
        label: 'Administradores',
        href: ROUTES.usuarios + '?filter_role=1',
        icon: UserCircleGearIcon,
        accent: 1
      },
      {
        key: 'moderators',
        label: 'Moderadores',
        href: ROUTES.usuarios + '?filter_role=2',
        icon: ShieldIcon,
        accent: 4
      }
    ]
  },
  {
    section: 'Publicidad',
    items: [
      {
        key: 'banners',
        label: 'Banners',
        href: ROUTES.banners,
        icon: FolderOpenIcon,
        accent: 5
      },
      {
        key: 'sponsors',
        label: 'Sponsors',
        href: ROUTES.sponsors,
        icon: HashIcon,
        accent: 1
      }
    ]
  }
]

type TopSection = {
  section: string
  icon: ReactNode
  emptyMessage: string
  dataKey: keyof TopGames
}

const TOP_SECTIONS: TopSection[] = [
  {
    section: 'Más reseñados',
    icon: <TrophyIcon className="text-amber-500" size={14} weight="regular" />,
    emptyMessage: 'Aún no hay juegos con reseñas.',
    dataKey: 'top_by_reviews'
  },
  {
    section: 'Mejor valorados',
    icon: <MedalIcon className="text-primary" size={14} weight="regular" />,
    emptyMessage: 'Aún no hay juegos valorados.',
    dataKey: 'top_by_rating'
  }
]

export function AdminDashboardPage() {
  const { token } = useAuthStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [topGames, setTopGames] = useState<TopGames | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    Promise.all([AdminService.getStats(token), AdminService.getTopGames(token)])
      .then(([statsRes, gamesRes]) => {
        if (statsRes.error) toast.error(statsRes.error)
        else setStats(statsRes.data)

        if (gamesRes.error) toast.error(gamesRes.error)
        else setTopGames(gamesRes.data)
      })
      .catch(() => toast.error('No se pudo conectar con el servidor.'))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_GROUPS.map(group => (
          <div key={group.section} className="flex flex-col gap-3">
            <Text variant="label">{group.section}</Text>
            <div className="flex flex-wrap gap-3">
              {group.items.map(({ key, ...cardProps }) => (
                <StatCard key={key} {...cardProps} loading={loading} value={stats?.[key] ?? 0} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Top juegos */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {TOP_SECTIONS.map(({ section, icon, emptyMessage, dataKey }) => (
          <div key={section} className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              {icon}
              <Text variant="label">{section}</Text>
            </div>
            <TopGamesList emptyMessage={emptyMessage} games={topGames?.[dataKey] ?? []} />
          </div>
        ))}
      </div>
    </section>
  )
}
