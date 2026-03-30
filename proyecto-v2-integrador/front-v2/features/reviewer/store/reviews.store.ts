import { create } from 'zustand'

import { type GameItem, type Review } from '../services/reviews.service'

type ReviewsStore = {
  reviews: Review[]
  loading: boolean
  preSelectedGame: GameItem | null
  setReviews: (reviews: Review[]) => void
  addReview: (review: Review) => void
  setLoading: (loading: boolean) => void
  setPreSelectedGame: (game: GameItem | null) => void
}

export const useReviewsStore = create<ReviewsStore>(set => ({
  reviews: [],
  loading: true,
  preSelectedGame: null,
  setReviews: reviews => set({ reviews }),
  addReview: review => set(state => ({ reviews: [review, ...state.reviews] })),
  setLoading: loading => set({ loading }),
  setPreSelectedGame: game => set({ preSelectedGame: game })
}))
