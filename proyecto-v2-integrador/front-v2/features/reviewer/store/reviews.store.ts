import { create } from 'zustand'

import { type GameSearchItem } from '@/features/shared/types/game.types'

import { type Review } from '../services/reviews.service'

type ReviewsStore = {
  reviews: Review[]
  loading: boolean
  preSelectedGame: GameSearchItem | null
  setReviews: (reviews: Review[]) => void
  appendReviews: (reviews: Review[]) => void
  addReview: (review: Review) => void
  setLoading: (loading: boolean) => void
  setPreSelectedGame: (game: GameSearchItem | null) => void
}

export const useReviewsStore = create<ReviewsStore>(set => ({
  reviews: [],
  loading: true,
  preSelectedGame: null,
  setReviews: reviews => set({ reviews }),
  appendReviews: newReviews => set(state => ({ reviews: [...state.reviews, ...newReviews] })),
  addReview: review => set(state => ({ reviews: [review, ...state.reviews] })),
  setLoading: loading => set({ loading }),
  setPreSelectedGame: game => set({ preSelectedGame: game })
}))
