import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Vista activa para usuarios con rol admin.
 * - 'admin' → navega con los ítems de administración.
 * - 'user'  → navega como si fuera un usuario normal.
 *
 * Los usuarios no-admin ignoran este valor; siempre ven su propia vista.
 */
export type ViewMode = 'admin' | 'user'

type ViewModeStore = {
  viewMode: ViewMode
  toggle: () => void
  reset: () => void
}

export const useViewModeStore = create<ViewModeStore>()(
  persist(
    set => ({
      viewMode: 'admin',
      toggle: () => set(state => ({ viewMode: state.viewMode === 'admin' ? 'user' : 'admin' })),
      reset: () => set({ viewMode: 'admin' })
    }),
    { name: 'view-mode-storage' }
  )
)
