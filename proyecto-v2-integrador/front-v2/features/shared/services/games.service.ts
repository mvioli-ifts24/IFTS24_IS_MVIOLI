import { type ApiResponse } from '../types/api.types'
import { type GameSearchItem } from '../types/game.types'

import { getAuthHeaders } from './api.helpers'

export const GamesService = {
  async searchAll(token: string): Promise<ApiResponse<GameSearchItem[]>> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
      headers: getAuthHeaders(token)
    })

    return response.json()
  }
}
