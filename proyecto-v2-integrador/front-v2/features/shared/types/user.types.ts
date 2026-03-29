export type User = {
  id: number
  name: string | null
  surname: string | null
  email: string
  birth_date?: string | null
  gender_id: number
  profile_picture_url?: string | null
  accept_newsletter?: number
  favorite_game_id?: number | null
  favorite_game_title?: string | null
  favorite_game_thumbnail?: string | null
  email_verified?: number
  about?: string | null
  role: UserRole
  deleted_at?: string | null
}

export type UserRole = 'admin' | 'moderator' | 'user'

export type UserRoleOption = {
  id: number
  name: UserRole
  label: string
}
