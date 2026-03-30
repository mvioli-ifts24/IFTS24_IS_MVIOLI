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
  EDIT_PREFERENCES: 'modal/profile/edit-preferences',

  // Admin — Users
  ADMIN_EDIT_USER_ROLE: 'modal/admin/edit-user-role',
  ADMIN_DELETE_USER: 'modal/admin/delete-user',

  // Admin — Banners
  ADMIN_BANNER_FORM: 'modal/admin/banner-form',
  ADMIN_BANNER_DELETE: 'modal/admin/banner-delete',

  // Admin — Sponsors
  ADMIN_SPONSOR_FORM: 'modal/admin/sponsor-form',
  ADMIN_SPONSOR_DELETE: 'modal/admin/sponsor-delete',

  // Reviewer
  CREATE_REVIEW: 'modal/reviewer/create-review',
  REPORT_REVIEW: 'modal/reviewer/report-review'
} as const

/**
 * Type para asegurar que solo se usen IDs válidos
 * Útil para type-safety si quieres ser muy estricto
 */
export type ModalId = (typeof MODAL_IDS)[keyof typeof MODAL_IDS]
