import { UserIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'

import { type Size } from '../types'

export type AvatarFallback = 'initials' | 'icon'
export type AvatarSize = Size

export interface AvatarProps {
  /**
   * URL de imagen del avatar
   */
  src?: string | null

  /**
   * Texto alternativo para accesibilidad
   */
  alt?: string

  /**
   * Tamaño del avatar
   * @default 'm'
   *  xs = 24px, sm = 32px, m = 40px, lg = 56px, xl = 80px
   */
  size?: AvatarSize

  /**
   * Fallback cuando no hay imagen
   * @default 'initials'
   */
  fallback?: AvatarFallback

  /**
   * Nombre para generar iniciales automáticamente
   */
  name?: string

  /**
   * Apellido para generar iniciales automáticamente
   */
  surname?: string

  /**
   * Clases CSS adicionales
   */
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  m: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-xl'
}

function resolveInitials(name?: string, surname?: string) {
  const first = name?.trim().charAt(0) || ''
  const last = surname?.trim().charAt(0) || ''

  return `${first}${last}`.toUpperCase() || '??'
}

export function Avatar({
  src,
  alt = 'Avatar de usuario',
  size = 'm',
  fallback = 'initials',
  name,
  surname,
  className = ''
}: AvatarProps) {
  const resolvedInitials = resolveInitials(name, surname)
  const iconNode = <UserIcon />

  return (
    <div
      aria-label={alt}
      className={[
        'bg-background relative flex aspect-square items-center justify-center overflow-hidden rounded-full border border-neutral-100 text-neutral-500',
        sizeClasses[size],
        className
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
    >
      {src ? (
        <Image alt={alt} className="h-full w-full" height={80} src={src} width={80} />
      ) : fallback === 'icon' ? (
        <span className="flex h-full w-full items-center justify-center text-2xl">{iconNode}</span>
      ) : (
        <span>{resolvedInitials}</span>
      )}
    </div>
  )
}
