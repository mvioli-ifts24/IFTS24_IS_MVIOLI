import { create } from 'zustand'

import { User } from '@/features/shared/types/user.types'

import { OwnReview } from '../services/profile.service'

type ProfileStore = {
  profile: User | null
  reviews: OwnReview[]
  loading: boolean
  loadingReviews: boolean

  setProfile: (profile: User) => void
  updateProfile: (patch: Partial<User>) => void
  setReviews: (reviews: OwnReview[]) => void
  setLoading: (loading: boolean) => void
  setLoadingReviews: (loading: boolean) => void
  reset: () => void
}

export const useProfileStore = create<ProfileStore>(set => ({
  profile: null,
  reviews: [],
  loading: true,
  loadingReviews: false,

  setProfile: profile => set({ profile }),
  updateProfile: patch =>
    set(state => ({
      profile: state.profile ? { ...state.profile, ...patch } : state.profile
    })),
  setReviews: reviews => set({ reviews }),
  setLoading: loading => set({ loading }),
  setLoadingReviews: loadingReviews => set({ loadingReviews }),
  reset: () => set({ profile: null, reviews: [], loading: true, loadingReviews: false })
}))
