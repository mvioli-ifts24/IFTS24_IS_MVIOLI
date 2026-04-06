import { type Review } from '@/features/reviewer/services/reviews.service'
import { getAuthHeaders } from '@/features/shared/services/api.helpers'
import { type ApiResponse } from '@/features/shared/types/api.types'
import { type GameSearchItem } from '@/features/shared/types/game.types'

export type GameDetail = {
  id: number
  title: string
  thumbnail: string
  short_description: string
  description?: string
  genre: string
  platform: string
  publisher: string
  developer: string
  release_date: string
  status?: string
}

export type GameReviewsData = {
  ownReview: Review | null
  othersReviews: Review[]
  avg_rating: number | null
  review_count: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const ExplorerService = {
  async getGames(token: string): Promise<ApiResponse<GameSearchItem[]>> {
    const response = await fetch(`${API_URL}/games`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  },

  async getGameById(token: string, id: number): Promise<ApiResponse<GameDetail>> {
    const response = await fetch(`${API_URL}/games/${id}`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  },

  async getRecentReviews(token: string): Promise<ApiResponse<Review[]>> {
    const response = await fetch(`${API_URL}/games_reviews`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  },

  async getGameReviews(token: string, gameId: number): Promise<ApiResponse<GameReviewsData>> {
    const response = await fetch(`${API_URL}/games_reviews/game/${gameId}`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  }
}
