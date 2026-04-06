import Link from 'next/link'

import { Avatar } from '../atoms/Avatar'
import { Text } from '../atoms/Text'

export type UserMiniCardProps = {
  name?: string | null
  surname?: string | null
  avatar?: string | null
  email?: string
  href?: string
}

export function UserMiniCard({ name, surname, avatar, email, href }: UserMiniCardProps) {
  const displayName = [name, surname].filter(Boolean).join(' ') || email || 'Usuario'

  const className =
    'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-200'

  const content = (
    <>
      <Avatar
        fallback="initials"
        name={name ?? undefined}
        size="xs"
        src={avatar ?? undefined}
        surname={surname ?? undefined}
      />
      <Text className="truncate" size="sm" weight="medium">
        {displayName}
      </Text>
    </>
  )

  if (href) {
    return (
      <Link className={className} href={href}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
