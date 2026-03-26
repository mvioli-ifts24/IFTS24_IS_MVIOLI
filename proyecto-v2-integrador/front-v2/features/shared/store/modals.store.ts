import { create } from 'zustand'

/**
 * Store global para manejar cualquier modal en la aplicación
 *
 * Este store es completamente agnóstico y no está acoplado a ninguna lógica de negocio.
 * Permite gestionar el estado abierto/cerrado de múltiples modales desde un único lugar centralizado.
 *
 * Cada modal se identifica por un ID único de string, permitiendo reutilizarlo desde cualquier feature.
 *
 * BUENAS PRÁCTICAS:
 * - Store agnóstico: No contiene lógica específica de features
 * - Hook genérico: useModal(id) funciona para cualquier modal
 * - IDs centralizados: Definidos en modals.constants.ts para fácil mantenimiento
 * - Selectors explícitos: Uso directo del estado sin funciones duplicadas
 */
interface ModalsStore {
  /**
   * Objeto que guarda el estado abierto/cerrado de cada modal
   * Record<modalId, isOpen>
   */
  modals: Record<string, boolean>

  /**
   * Abre un modal por su ID
   */
  open: (id: string) => void

  /**
   * Cierra un modal por su ID
   */
  close: (id: string) => void

  /**
   * Alterna el estado de un modal
   */
  toggle: (id: string) => void

  /**
   * Obtiene el estado de un modal específico
   */
  isOpen: (id: string) => boolean

  /**
   * Cierra todos los modales abiertos
   */
  closeAll: () => void
}

/**
 * Store Zustand para modales
 *
 * Usa Zustand para gestionar estado de forma eficiente con re-renders mínimos
 * gracias a los selectores.
 */
export const useModalsStore = create<ModalsStore>((set, get) => ({
  modals: {},

  open: (id: string) => {
    set(state => ({
      modals: {
        ...state.modals,
        [id]: true
      }
    }))
  },

  close: (id: string) => {
    set(state => ({
      modals: {
        ...state.modals,
        [id]: false
      }
    }))
  },

  toggle: (id: string) => {
    const currentState = get().isOpen(id)

    if (currentState) {
      get().close(id)
    } else {
      get().open(id)
    }
  },

  isOpen: (id: string) => {
    return get().modals[id] ?? false
  },

  closeAll: () => {
    set({ modals: {} })
  }
}))

/**
 * Hook genérico para cualquier modal
 *
 * VENTAJAS:
 * - Agnóstico: Funciona con cualquier ID de modal
 * - Reutilizable: Puede usarse desde cualquier feature sin acoplamiento
 * - Simple: Una interfaz consistente para todos los modales
 *
 * @param id - Identificador único del modal (ej: 'modal/edit-profile')
 * @returns Objeto con control del modal
 *
 * @example
 * ```tsx
 * // En ProfileHeader.tsx
 * const { isOpen, open, close } = useModal('modal/edit-profile')
 *
 * // En PasswordChangeModal.tsx
 * const { isOpen, open, close } = useModal('modal/change-password')
 *
 * // En cualquier otro componente
 * const { isOpen, open, close } = useModal('modal/custom-modal')
 * ```
 */
export function useModal(id: string) {
  const isOpen = useModalsStore(state => state.isOpen(id))
  const open = useModalsStore(state => state.open)
  const close = useModalsStore(state => state.close)

  return {
    isOpen,
    open: () => open(id),
    close: () => close(id),
    toggle: () => useModalsStore.getState().toggle(id)
  }
}
