import Image from 'next/image'

import { Text } from '../atoms/Text'

export interface ReviewCardProps {
  gameTitle: string
  description: string
  rating: string | number
  gameThumbnail?: string
  authorName?: string
  className?: string
}

export function ReviewCard({
  gameTitle,
  description,
  rating,
  gameThumbnail,
  authorName,
  className = ''
}: ReviewCardProps) {
  return (
    <article className={`flex gap-3 rounded-lg border border-neutral-200 p-3 ${className}`.trim()}>
      {gameThumbnail && (
        <Image
          alt={gameTitle}
          className="aspect-12/16 shrink-0 rounded object-cover"
          height={64}
          src={gameThumbnail}
          width={36}
        />
      )}
      <div className="flex min-w-0 flex-col gap-0.5">
        <Text weight="medium">{gameTitle}</Text>
        {authorName && (
          <Text size="xs" variant="muted">
            {authorName}
          </Text>
        )}
        <Text className="line-clamp-2" size="sm" variant="muted">
          {description}
        </Text>
        <Text className="mt-1" size="xs" variant="muted">
          Valoración: {rating}
        </Text>
      </div>
    </article>
  )
}
