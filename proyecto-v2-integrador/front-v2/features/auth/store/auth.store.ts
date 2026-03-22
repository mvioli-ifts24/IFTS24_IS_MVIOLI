import type { User } from '@/shared/types/user.types'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: AuthStore['token'], user: AuthStore['user']) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    set => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false })
    }),
    {
      name: 'auth-storage'
    }
  )
)
