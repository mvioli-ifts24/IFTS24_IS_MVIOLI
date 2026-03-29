import { type ApiResponse, type PaginatedApiResponse } from '@/features/shared/types/api.types'
import { type Sponsor } from '@/features/shared/types/media.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export type GetAllSponsorsParams = {
  page?: number
  pageSize?: number
  search?: string
}

export const SponsorsAdminService = {
  async getAll(
    token: string,
    params: GetAllSponsorsParams = {}
  ): Promise<PaginatedApiResponse<Sponsor>> {
    const qs = new URLSearchParams()

    if (params.page) qs.set('page', String(params.page))
    if (params.pageSize) qs.set('pageSize', String(params.pageSize))
    if (params.search) qs.set('search', params.search)

    const query = qs.toString()
    const url = `${API_URL}/admin/sponsors${query ? `?${query}` : ''}`

    const response = await fetch(url, {
      headers: authHeaders(token)
    })

    return await response.json()
  },

  async create(token: string, formData: FormData): Promise<ApiResponse<Sponsor>> {
    const response = await fetch(`${API_URL}/admin/sponsors`, {
      method: 'POST',
      headers: authHeaders(token),
      body: formData
    })

    return await response.json()
  },

  async update(token: string, id: number, formData: FormData): Promise<ApiResponse<Sponsor>> {
    const response = await fetch(`${API_URL}/admin/sponsors/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: formData
    })

    return await response.json()
  },

  async remove(token: string, id: number): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_URL}/admin/sponsors/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    })

    return await response.json()
  }
}
