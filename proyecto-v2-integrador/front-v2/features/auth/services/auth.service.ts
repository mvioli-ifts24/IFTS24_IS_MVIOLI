import { ApiResponse } from '@/shared/types/api.types'
import { User } from '@/shared/types/user.types'

import { RegisterFormData } from '../schemas/register'

export const AuthService = {
  async register(data: RegisterFormData): Promise<ApiResponse<User>> {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('surname', data.surname)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)
    formData.append('gender_id', data.gender_id)
    formData.append('accept_newsletter', String(data.accept_newsletter))
    formData.append('profile_picture', data.profile_picture)
    formData.append('birthDate', data.birthDate.toISOString())

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: 'POST',
      body: formData
    })

    return await response.json()
  }
}
