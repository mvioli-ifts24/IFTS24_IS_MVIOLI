import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { User } from '@/features/shared/types/user.types'

type AuthStore = {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    set => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      updateUser: userPatch =>
        set(state => ({
          user: state.user ? { ...state.user, ...userPatch } : state.user
        })),
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
