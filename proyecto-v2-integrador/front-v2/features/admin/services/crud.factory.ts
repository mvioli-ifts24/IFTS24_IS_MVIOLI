import { getAuthHeaders } from '@/features/shared/services/api.helpers'
import { type ApiResponse, type PaginatedApiResponse } from '@/features/shared/types/api.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Tipo base de parámetros para listados paginados.
 * Extendible por entidad: `CrudListParams & { role_id?: number }`.
 */
export type CrudListParams = {
  page?: number
  pageSize?: number
  search?: string
}

/**
 * Tipo de retorno normalizado acordado para todos los servicios CRUD de admin.
 *
 * Listado:  PaginatedApiResponse<T>  → { data, error, total, page, pageSize, prevUrl, nextUrl }
 * Mutación: ApiResponse<T>           → { data, error }
 * Borrado:  ApiResponse<null>        → { data: null, error }
 *
 * El backend debe matchear estos tipos en todos los endpoints CRUD de administración.
 */
export function createAdminCrudService<T, TListParams extends CrudListParams = CrudListParams>(
  endpoint: string
) {
  const base = `${API_URL}${endpoint}`

  return {
    async getAll(token: string, params?: TListParams): Promise<PaginatedApiResponse<T>> {
      const qs = new URLSearchParams()

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v) qs.set(k, String(v))
        })
      }

      const q = qs.toString()
      const response = await fetch(`${base}${q ? `?${q}` : ''}`, {
        headers: getAuthHeaders(token)
      })

      return response.json()
    },

    async create(token: string, formData: FormData): Promise<ApiResponse<T>> {
      const response = await fetch(base, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: formData
      })

      return response.json()
    },

    async update(token: string, id: number, formData: FormData): Promise<ApiResponse<T>> {
      const response = await fetch(`${base}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: formData
      })

      return response.json()
    },

    async remove(token: string, id: number): Promise<ApiResponse<null>> {
      const response = await fetch(`${base}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      })

      return response.json()
    }
  }
}
