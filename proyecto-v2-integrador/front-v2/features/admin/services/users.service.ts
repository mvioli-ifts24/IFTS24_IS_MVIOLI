import { getAuthHeaders } from '@/features/shared/services/api.helpers'
import { type ApiResponse } from '@/features/shared/types/api.types'
import { type User } from '@/features/shared/types/user.types'

import { createAdminCrudService, type CrudListParams } from './crud.factory'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type GetAllUsersParams = CrudListParams & { role_id?: number }

const base = createAdminCrudService<User, GetAllUsersParams>('/admin/users')

export const UsersAdminService = {
  getAll: base.getAll,
  remove: base.remove,

  async updateRole(token: string, id: number, role_id: number): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role_id })
    })

    return response.json()
  }
}
