import { type PaginatedApiResponse } from '@/features/shared/types/api.types'
import { type Banner } from '@/features/shared/types/media.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const BannersService = {
  async getAll(token: string, pageSize = 50): Promise<PaginatedApiResponse<Banner>> {
    const qs = new URLSearchParams({ pageSize: String(pageSize) })
    const response = await fetch(`${API_URL}/banners?${qs}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return response.json()
  }
}
