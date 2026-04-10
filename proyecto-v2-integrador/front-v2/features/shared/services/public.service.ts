import { type ApiResponse } from '../types/api.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type PublicStats = {
  users: number
  reviews: number
  games: number
}

export type PublicReview = {
  id: number
  title: string
  description: string
  rating_id: number
  rating: string
  api_game_id: number
  created_at: string
  user_name: string | null
  user_surname: string | null
  user_avatar: string | null
  game_title: string
  game_thumbnail: string
}

export const PublicService = {
  async getStats(): Promise<ApiResponse<PublicStats>> {
    const response = await fetch(`${API_URL}/public/stats`, {
      next: { revalidate: 3600 }
    })

    return response.json()
  },

  async getRecentReviews(limit = 100): Promise<ApiResponse<PublicReview[]>> {
    const response = await fetch(`${API_URL}/public/reviews?limit=${limit}`, {
      next: { revalidate: 300 }
    })

    return response.json()
  },

  async getBanners(): Promise<{ data: import('../types/media.types').Banner[] | null }> {
    const response = await fetch(`${API_URL}/public/banners?pageSize=20`, {
      next: { revalidate: 3600 }
    })

    return response.json()
  },

  async getSponsors(): Promise<{ data: import('../types/media.types').Sponsor[] | null }> {
    const response = await fetch(`${API_URL}/public/sponsors?pageSize=50`, {
      next: { revalidate: 3600 }
    })

    return response.json()
  }
}
