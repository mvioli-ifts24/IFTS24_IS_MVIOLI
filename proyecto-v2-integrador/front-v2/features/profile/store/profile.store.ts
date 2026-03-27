import { create } from 'zustand'

import { User } from '@/features/shared/types/user.types'

import { OwnReview, UserGenderItem } from '../services/profile.service'

type ProfileStore = {
  profile: User | null
  reviews: OwnReview[]
  loading: boolean
  loadingReviews: boolean
  genders: UserGenderItem[]
  gendersLoading: boolean

  setProfile: (profile: User) => void
  updateProfile: (patch: Partial<User>) => void
  setReviews: (reviews: OwnReview[]) => void
  setLoading: (loading: boolean) => void
  setLoadingReviews: (loading: boolean) => void
  setGenders: (genders: UserGenderItem[]) => void
  setGendersLoading: (v: boolean) => void
  reset: () => void
}

export const useProfileStore = create<ProfileStore>(set => ({
  profile: null,
  reviews: [],
  loading: true,
  loadingReviews: false,
  genders: [],
  gendersLoading: false,

  setProfile: profile => set({ profile }),
  updateProfile: patch =>
    set(state => ({
      profile: state.profile ? { ...state.profile, ...patch } : state.profile
    })),
  setReviews: reviews => set({ reviews }),
  setLoading: loading => set({ loading }),
  setLoadingReviews: loadingReviews => set({ loadingReviews }),
  setGenders: genders => set({ genders, gendersLoading: false }),
  setGendersLoading: v => set({ gendersLoading: v }),
  // genders no se resetea: son datos estáticos reutilizables en la sesión
  reset: () => set({ profile: null, reviews: [], loading: true, loadingReviews: false })
}))
