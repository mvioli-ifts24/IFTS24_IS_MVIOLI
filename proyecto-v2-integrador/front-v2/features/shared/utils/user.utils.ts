export function getUserDisplayName(user: {
  name?: string | null
  surname?: string | null
  email?: string | null
}): string {
  if (user.name && user.surname) return `${user.name} ${user.surname}`

  return user.name ?? user.email ?? '—'
}
