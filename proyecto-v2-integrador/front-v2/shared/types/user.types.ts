export type User = {
  id: number
  name: string
  surname: string
  email: string
  birthDate: string
  gender_id: number
  profilePictureUrl?: string | null
  newsletterSubscribed: boolean
  role: UserRole
  deletedAt?: string | null
}

export type UserRole = 'admin' | 'moderator' | 'user'
