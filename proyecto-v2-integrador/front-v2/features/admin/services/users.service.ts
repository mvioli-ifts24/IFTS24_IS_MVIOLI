import { getAuthHeaders as authHeaders } from '@/features/shared/services/api.helpers'
import { type ApiResponse, type PaginatedApiResponse } from '@/features/shared/types/api.types'
import { type User } from '@/features/shared/types/user.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type GetAllUsersParams = {
  page?: number
  pageSize?: number
  search?: string
  role_id?: number
}

export const UsersAdminService = {
  async getAll(token: string, params: GetAllUsersParams = {}): Promise<PaginatedApiResponse<User>> {
    const qs = new URLSearchParams()

    if (params.page) qs.set('page', String(params.page))
    if (params.pageSize) qs.set('pageSize', String(params.pageSize))
    if (params.search) qs.set('search', params.search)
    if (params.role_id) qs.set('role_id', String(params.role_id))

    const query = qs.toString()
    const url = `${API_URL}/admin/users${query ? `?${query}` : ''}`

    const response = await fetch(url, {
      headers: authHeaders(token)
    })

    return await response.json()
  },

  async updateRole(token: string, id: number, role_id: number): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: {
        ...authHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role_id })
    })

    return await response.json()
  },

  async remove(token: string, id: number): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    })

    return await response.json()
  }
}
