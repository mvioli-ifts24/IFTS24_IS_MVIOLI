import type { LoginFormData } from '../schemas/login'
import type { RegisterFormData } from '../schemas/register'

import { ApiResponse } from '@/features/shared/types/api.types'
import { User } from '@/features/shared/types/user.types'

export type GenderItem = {
  id: number
  label: string
}

export type AuthResponse = {
  token: string
  user: User
}

export const AuthService = {
  async login(data: LoginFormData): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return await response.json()
  },

  async register(data: RegisterFormData): Promise<ApiResponse<AuthResponse>> {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('surname', data.surname)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)
    formData.append('gender_id', data.gender_id)
    formData.append('accept_newsletter', String(data.accept_newsletter))
    formData.append('birthDate', data.birthDate.toISOString())
    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture)
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      body: formData
    })

    return await response.json()
  },

  async getGenders(): Promise<ApiResponse<GenderItem[]>> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users_genders`)

    return await response.json()
  }
}
