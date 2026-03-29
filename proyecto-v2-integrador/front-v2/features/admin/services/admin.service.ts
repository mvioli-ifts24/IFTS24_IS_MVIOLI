import { ApiResponse } from '@/features/shared/types/api.types'
import { type UserRoleOption } from '@/features/shared/types/user.types'

export type AdminStats = {
  users: number
  admins: number
  moderators: number
  reviews: number
  banners: number
  sponsors: number
  pending_messages: number
}

export type TopGameEntry = {
  api_id: number
  title: string
  thumbnail: string
  review_count: number
  avg_rating: number
}

export type TopGames = {
  top_by_reviews: TopGameEntry[]
  top_by_rating: TopGameEntry[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export const AdminService = {
  async getStats(token: string): Promise<ApiResponse<AdminStats>> {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: authHeaders(token)
    })

    return await response.json()
  },

  async getTopGames(token: string): Promise<ApiResponse<TopGames>> {
    const response = await fetch(`${API_URL}/admin/top-games`, {
      headers: authHeaders(token)
    })

    return await response.json()
  },

  async getRoles(token: string): Promise<ApiResponse<UserRoleOption[]>> {
    const response = await fetch(`${API_URL}/admin/roles`, {
      headers: authHeaders(token)
    })

    return await response.json()
  }
}
