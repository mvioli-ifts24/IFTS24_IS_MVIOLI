'use client'

import { useEffect, useMemo, useState } from 'react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { type Review } from '@/features/reviewer/services/reviews.service'
import { AdBanner } from '@/features/shared/components/ad-banners/AdBanner'
import { ROUTES } from '@/features/shared/constants/nav.constants'
import { type GameSearchItem } from '@/features/shared/types/game.types'
import { CardWrapper, GameRow, Heading, SearchInput, Text, UserMiniCard } from '@/ui'

import { ExplorerService } from '../services/explorer.service'

type FeaturedUser = {
  name?: string | null
  surname?: string | null
  avatar?: string | null
  email?: string
}

function extractUsers(reviews: Review[]): FeaturedUser[] {
  const seen = new Set<string>()

  return reviews.reduce<FeaturedUser[]>((acc, r) => {
    if (r.user_email && !seen.has(r.user_email)) {
      seen.add(r.user_email)
      acc.push({
        name: r.user_name,
        surname: r.user_surname,
        avatar: r.user_avatar,
        email: r.user_email
      })
    }

    return acc
  }, [])
}

export function ExplorerPage() {
  const { token } = useAuthStore()
  const [query, setQuery] = useState('')
  const [games, setGames] = useState<GameSearchItem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!token) return
    Promise.all([ExplorerService.getGames(token), ExplorerService.getRecentReviews(token)]).then(
      ([gamesRes, reviewsRes]) => {
        if (gamesRes.data) setGames(gamesRes.data)
        if (reviewsRes.data) setReviews(reviewsRes.data)
      }
    )
  }, [token])

  const filteredGames = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()

    return games.filter(g => g.title.toLowerCase().includes(q)).slice(0, 8)
  }, [games, query])

  const allUsers = useMemo(() => extractUsers(reviews), [reviews])

  const filteredUsers = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()

    return allUsers
      .filter(u => [u.name, u.surname, u.email].filter(Boolean).join(' ').toLowerCase().includes(q))
      .slice(0, 6)
  }, [allUsers, query])

  const hasResults = filteredGames.length > 0 || filteredUsers.length > 0

  return (
    <div className="mx-auto flex w-full max-w-5xl items-start gap-6">
      <section className="flex min-w-0 flex-1 flex-col gap-6">
        <CardWrapper className="flex flex-col gap-3" elevation="0">
          <Heading level="h1" size="m" variant="primary">
            Explorar
          </Heading>
          <Text color="muted">Buscá juegos y usuarios de la plataforma</Text>
          <SearchInput id="explorer-search" onChange={setQuery} value={query} />
        </CardWrapper>

        {/* Mobile: banner vertical entre header y resultados */}
        <div className="lg:hidden">
          <AdBanner className="overflow-hidden" orientation="vertical" />
        </div>

        {/* Resultados de búsqueda */}
        {query && (
          <div className="flex flex-col gap-6">
            {filteredGames.length > 0 && (
              <CardWrapper className="flex flex-col gap-4" elevation="0">
                <Heading level="h2" size="xs" variant="primary">
                  Juegos
                </Heading>
                <div className="flex flex-col gap-1">
                  {filteredGames.map(game => (
                    <GameRow
                      key={game.id}
                      href={`${ROUTES.juegos}/${game.id}`}
                      size="m"
                      thumbnail={game.thumbnail}
                      title={game.title}
                    />
                  ))}
                </div>
              </CardWrapper>
            )}

            {filteredUsers.length > 0 && (
              <CardWrapper className="flex flex-col gap-4" elevation="0">
                <Heading level="h2" size="xs" variant="primary">
                  Usuarios
                </Heading>
                <div className="flex flex-col gap-1">
                  {filteredUsers.map(u => (
                    <UserMiniCard
                      key={u.email}
                      avatar={u.avatar}
                      email={u.email}
                      href={u.email ? `${ROUTES.perfil}/${u.email}` : undefined}
                      name={u.name}
                      surname={u.surname}
                    />
                  ))}
                </div>
              </CardWrapper>
            )}

            {!hasResults && (
              <CardWrapper className="py-10 text-center" elevation="0">
                <Text color="muted">No se encontraron resultados para &ldquo;{query}&rdquo;</Text>
              </CardWrapper>
            )}
          </div>
        )}
      </section>

      {/* Desktop: sidebar sticky con banner vertical */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-6">
          <AdBanner orientation="vertical" />
        </div>
      </aside>
    </div>
  )
}
