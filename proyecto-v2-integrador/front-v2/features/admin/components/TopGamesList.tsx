import { ROUTES } from '@/features/shared/constants/nav.constants'
import { CardWrapper, GameRow, StarRating, Text } from '@/ui'

import { type TopGameEntry } from '../services/admin.service'

function TopGameItem({ game, rank }: { game: TopGameEntry; rank: number }) {
  const avgRating = Number(game.avg_rating)

  return (
    <li>
      <GameRow
        elevation="1"
        href={`${ROUTES.juegos}/${game.api_id}`}
        rank={rank}
        size="lg"
        suffix={
          avgRating > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating size={16} value={Math.round(avgRating * 2) / 2} />
              <Text color="muted" size="xs">
                {avgRating.toFixed(1)} ({game.review_count} reseña
                {game.review_count !== 1 ? 's' : ''})
              </Text>
            </div>
          ) : undefined
        }
        thumbnail={game.thumbnail}
        title={game.title}
      />
    </li>
  )
}

export type TopGamesListProps = {
  games: TopGameEntry[]
  emptyMessage?: string
}

export function TopGamesList({ games, emptyMessage = 'Aún no hay datos.' }: TopGamesListProps) {
  if (!games.length) {
    return (
      <CardWrapper elevation="0" padding="md">
        <Text color="muted">{emptyMessage}</Text>
      </CardWrapper>
    )
  }

  return (
    <CardWrapper as="ul" className="flex flex-col gap-4" elevation="0" padding="md">
      {games.map((game, i) => (
        <TopGameItem key={game.api_id} game={game} rank={i + 1} />
      ))}
    </CardWrapper>
  )
}
