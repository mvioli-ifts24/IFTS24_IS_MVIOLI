/**
 * IDs constantes para todos los modales de la aplicación
 *
 * CONVENCIÓN DE NAMING:
 * - Prefijo: 'modal/'
 * - Formato: 'modal/feature/action' o 'modal/action'
 * - Ejemplo: 'modal/profile/edit', 'modal/auth/confirm'
 *
 * Esta centralización permite:
 * - Evitar strings hardcodeados en componentes
 * - Mantener un control único de todos los modales
 * - Fácil búsqueda y refactorización global
 * - Reutilización desde cualquier feature sin acoplamiento
 */

export const MODAL_IDS = {
  // Profile modals
  EDIT_PROFILE: 'modal/profile/edit',
  CHANGE_PASSWORD: 'modal/profile/change-password',
  EDIT_PREFERENCES: 'modal/profile/edit-preferences'
} as const

/**
 * Type para asegurar que solo se usen IDs válidos
 * Útil para type-safety si quieres ser muy estricto
 */
export type ModalId = (typeof MODAL_IDS)[keyof typeof MODAL_IDS]
