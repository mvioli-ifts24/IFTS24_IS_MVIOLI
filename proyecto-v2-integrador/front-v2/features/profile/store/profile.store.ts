import { create } from 'zustand'

import { User } from '@/features/shared/types/user.types'

import { UserGenderItem } from '../services/profile.service'

type ProfileStore = {
  profile: User | null
  loading: boolean
  genders: UserGenderItem[]
  gendersLoading: boolean

  setProfile: (profile: User) => void
  updateProfile: (patch: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setGenders: (genders: UserGenderItem[]) => void
  setGendersLoading: (v: boolean) => void
  reset: () => void
}

export const useProfileStore = create<ProfileStore>(set => ({
  profile: null,
  loading: true,
  genders: [],
  gendersLoading: false,

  setProfile: profile => set({ profile }),
  updateProfile: patch =>
    set(state => ({
      profile: state.profile ? { ...state.profile, ...patch } : state.profile
    })),
  setLoading: loading => set({ loading }),
  setGenders: genders => set({ genders, gendersLoading: false }),
  setGendersLoading: v => set({ gendersLoading: v }),
  // genders no se resetea: son datos estáticos reutilizables en la sesión
  reset: () => set({ profile: null, loading: true })
}))
