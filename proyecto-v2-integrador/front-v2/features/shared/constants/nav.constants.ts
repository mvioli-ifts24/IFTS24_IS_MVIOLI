/**
 * Rutas del dashboard centralizadas.
 *
 * CONVENCIÓN: usar siempre estas constantes en lugar de strings literales
 * para que un cambio de URL solo requiera modificar este archivo.
 */
export const ROUTES = {
  dashboard: '/dashboard',
  busqueda: '/dashboard/busqueda',
  ayuda: '/dashboard/ayuda',
  perfil: '/dashboard/perfil',
  sobreNosotros: '/dashboard/sobre-nosotros',
  // Admin
  usuarios: '/dashboard/usuarios',
  administradores: '/dashboard/administradores',
  banners: '/dashboard/banners',
  sponsors: '/dashboard/sponsors'
} as const

// ---------------------------------------------------------------------------
// NAV_ITEMS — consumido por Sidebar
// ---------------------------------------------------------------------------

import {
  BookOpenIcon,
  FolderOpenIcon,
  GraduationCapIcon,
  HashIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  UserCircleGearIcon,
  UserIcon,
  UsersIcon
} from '@phosphor-icons/react'

import { UserRole } from '@/features/shared/types/user.types'

export type NavItem = {
  label: string
  href: string
  icon: typeof HouseIcon
  allowedRoles?: UserRole[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: ROUTES.dashboard, icon: HouseIcon },
  {
    label: 'Búsqueda',
    href: ROUTES.busqueda,
    icon: MagnifyingGlassIcon,
    allowedRoles: ['user', 'moderator']
  },
  {
    label: 'Ayuda',
    href: ROUTES.ayuda,
    icon: BookOpenIcon,
    allowedRoles: ['user', 'moderator']
  },
  { label: 'Usuarios', href: ROUTES.usuarios, icon: UsersIcon, allowedRoles: ['admin'] },
  {
    label: 'Banners',
    href: ROUTES.banners,
    icon: FolderOpenIcon,
    allowedRoles: ['admin']
  },
  { label: 'Sponsors', href: ROUTES.sponsors, icon: HashIcon, allowedRoles: ['admin'] },
  { label: 'Sobre Nosotros', href: ROUTES.sobreNosotros, icon: GraduationCapIcon }
]

// ---------------------------------------------------------------------------
// SEGMENT_LABELS / SEGMENT_ICONS — consumido por Breadcrumbs
// ---------------------------------------------------------------------------

export const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Inicio',
  usuarios: 'Usuarios',
  administradores: 'Administradores',
  banners: 'Banners',
  sponsors: 'Sponsors',
  perfil: 'Perfil',
  busqueda: 'Búsqueda',
  ayuda: 'Ayuda',
  'sobre-nosotros': 'Sobre nosotros',
  login: 'Iniciar sesión',
  register: 'Registrarse'
}

export const SEGMENT_ICONS: Record<string, typeof HouseIcon> = {
  dashboard: HouseIcon,
  usuarios: UsersIcon,
  administradores: UserCircleGearIcon,
  banners: FolderOpenIcon,
  sponsors: HashIcon,
  perfil: UserIcon,
  busqueda: MagnifyingGlassIcon,
  ayuda: BookOpenIcon,
  'sobre-nosotros': GraduationCapIcon
}
