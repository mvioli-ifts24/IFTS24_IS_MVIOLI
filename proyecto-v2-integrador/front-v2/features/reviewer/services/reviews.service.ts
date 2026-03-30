import { getAuthHeaders } from '@/features/shared/services/api.helpers'
import { ApiResponse } from '@/features/shared/types/api.types'

export type Review = {
  id: number
  title: string
  description: string
  rating: string
  rating_id: number
  game_title: string
  game_thumbnail: string
  api_game_id: number
  user_id?: number
  created_at?: string
  user_name?: string | null
  user_surname?: string | null
  user_avatar?: string | null
  user_email?: string
}

export type GameItem = {
  id: number
  title: string
  thumbnail: string
}

export type CreateReviewData = {
  title: string
  description: string
  rating_id: number
  api_game_id: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const ReviewsService = {
  async getRecentReviews(token: string, ratingId?: number): Promise<ApiResponse<Review[]>> {
    const params = ratingId ? `?rating_id=${ratingId}` : ''
    const response = await fetch(`${API_URL}/games_reviews${params}`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  },

  async getOwnReviews(token: string): Promise<ApiResponse<Review[]>> {
    const response = await fetch(`${API_URL}/games_reviews/user`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  },

  async getUserReviews(token: string, userId: number | string): Promise<ApiResponse<Review[]>> {
    const response = await fetch(`${API_URL}/games_reviews/user/${userId}`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  },

  async searchGames(token: string): Promise<ApiResponse<GameItem[]>> {
    const response = await fetch(`${API_URL}/games`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  },

  async createReview(token: string, data: CreateReviewData): Promise<ApiResponse<{ id: number }>> {
    const response = await fetch(`${API_URL}/games_reviews`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return response.json()
  }
}
