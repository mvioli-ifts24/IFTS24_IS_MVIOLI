import { type ApiResponse, type PaginatedApiResponse } from '@/features/shared/types/api.types'
import { type Banner } from '@/features/shared/types/media.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export type GetAllBannersParams = {
  page?: number
  pageSize?: number
  search?: string
}

export const BannersAdminService = {
  async getAll(
    token: string,
    params: GetAllBannersParams = {}
  ): Promise<PaginatedApiResponse<Banner>> {
    const qs = new URLSearchParams()

    if (params.page) qs.set('page', String(params.page))
    if (params.pageSize) qs.set('pageSize', String(params.pageSize))
    if (params.search) qs.set('search', params.search)

    const query = qs.toString()
    const url = `${API_URL}/admin/banners${query ? `?${query}` : ''}`

    const response = await fetch(url, {
      headers: authHeaders(token)
    })

    return await response.json()
  },

  async create(token: string, formData: FormData): Promise<ApiResponse<Banner>> {
    const response = await fetch(`${API_URL}/admin/banners`, {
      method: 'POST',
      headers: authHeaders(token),
      body: formData
    })

    return await response.json()
  },

  async update(token: string, id: number, formData: FormData): Promise<ApiResponse<Banner>> {
    const response = await fetch(`${API_URL}/admin/banners/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: formData
    })

    return await response.json()
  },

  async remove(token: string, id: number): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_URL}/admin/banners/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    })

    return await response.json()
  }
}
