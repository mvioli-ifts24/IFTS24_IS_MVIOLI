import { ApiResponse } from '@/shared/types/api.types'
import { User } from '@/shared/types/user.types'

export type GameSearchItem = {
  id: number
  title: string
  thumbnail: string
}

export type OwnReview = {
  id: number
  title: string
  description: string
  rating: string
  game_title: string
  game_thumbnail: string
}

export type UserGenderItem = {
  id: number
  label: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`
  }
}

export const ProfileService = {
  async getOwnProfile(token: string): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/users/own`, {
      headers: getAuthHeaders(token)
    })

    return await response.json()
  },

  async updateProfile(
    token: string,
    data: {
      about?: string
      favorite_game_id?: number | null
      profile_picture?: File
      birth_date?: string | null
      gender_id?: number
      accept_newsletter?: number
    }
  ): Promise<ApiResponse<User>> {
    const formData = new FormData()

    if (data.about !== undefined) {
      formData.append('about', data.about)
    }

    if (data.favorite_game_id !== undefined) {
      formData.append(
        'favorite_game_id',
        data.favorite_game_id ? String(data.favorite_game_id) : ''
      )
    }

    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture)
    }

    if (data.birth_date !== undefined) {
      formData.append('birth_date', data.birth_date || '')
    }

    if (data.gender_id !== undefined) {
      formData.append('gender_id', String(data.gender_id))
    }

    if (data.accept_newsletter !== undefined) {
      formData.append('accept_newsletter', String(data.accept_newsletter))
    }

    const response = await fetch(`${API_URL}/users`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: formData
    })

    return await response.json()
  },

  async verifyAccount(token: string): Promise<ApiResponse<{ email_verified: number }>> {
    const response = await fetch(`${API_URL}/auth/verify-account`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    })

    return await response.json()
  },

  async getUserGenders(token: string): Promise<ApiResponse<UserGenderItem[]>> {
    const response = await fetch(`${API_URL}/users_genders`, {
      headers: getAuthHeaders(token)
    })

    return await response.json()
  },

  async changePassword(
    token: string,
    data: { current_password: string; new_password: string; confirm_password: string }
  ): Promise<ApiResponse<{ updated: boolean }>> {
    const response = await fetch(`${API_URL}/users/password`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return await response.json()
  },

  async getOwnReviews(token: string): Promise<ApiResponse<OwnReview[]>> {
    const response = await fetch(`${API_URL}/games_reviews/user`, {
      headers: getAuthHeaders(token)
    })

    return await response.json()
  },

  async searchGames(token: string): Promise<ApiResponse<GameSearchItem[]>> {
    const response = await fetch(`${API_URL}/games`, {
      headers: getAuthHeaders(token)
    })

    return await response.json()
  }
}
