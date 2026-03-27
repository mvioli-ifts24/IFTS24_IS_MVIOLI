'use client'

import { CaretRightIcon, HouseIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ROUTES, SEGMENT_ICONS, SEGMENT_LABELS } from '@/features/shared/constants/nav.constants'

function segmentLabel(segment: string): string {
  return SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
}

/**
 * Breadcrumb logic:
 * - /dashboard               → muestra solo el ícono de casa con label "Inicio" (sin separador)
 * - /dashboard/seccion       → 🏠 Sección (la navegación principal del drawer es nivel raíz)
 * - /dashboard/seccion/sub   → 🏠 Sección > Sub
 */
function buildCrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const relevant = segments.filter(s => s !== 'dashboard')
  const crumbs: { label: string; href: string; segment: string }[] = []

  relevant.reduce((acc, seg) => {
    const href = `${acc}/${seg}`

    crumbs.push({ label: segmentLabel(seg), href, segment: seg })

    return href
  }, '/dashboard')

  return crumbs
}

export type BreadcrumbsProps = {
  className?: string
}

export function Breadcrumbs({ className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()
  const crumbs = buildCrumbs(pathname)
  const isDashboardRoot = pathname === ROUTES.dashboard

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex cursor-default items-center gap-1.5 ${className}`.trim()}
    >
      {isDashboardRoot ? (
        // En inicio: ícono + label "Inicio" como texto activo
        <>
          <HouseIcon className="text-neutral-400" size={14} weight="bold" />
          <span className="text-foreground text-xs font-medium">Inicio</span>
        </>
      ) : (
        // En otras rutas: ícono de la sección + segmentos (sin casa ni "Inicio")
        <>
          {(() => {
            const [first, ...rest] = crumbs

            if (!first) return null
            const SectionIcon = SEGMENT_ICONS[first.segment] ?? HouseIcon
            const isOnlyOne = rest.length === 0

            return (
              <>
                <SectionIcon className="text-neutral-400" size={14} />
                {isOnlyOne ? (
                  <span className="text-foreground text-xs font-medium">{first.label}</span>
                ) : (
                  <>
                    <Link
                      className="hover:text-foreground cursor-pointer text-xs text-neutral-400 transition-colors"
                      href={first.href}
                    >
                      {first.label}
                    </Link>
                    {rest.map((crumb, i) => {
                      const isLast = i === rest.length - 1

                      return (
                        <span key={crumb.href} className="flex items-center gap-1.5">
                          <CaretRightIcon
                            className="text-neutral-300 dark:text-neutral-500"
                            size={11}
                          />
                          {isLast ? (
                            <span className="text-foreground text-xs font-medium">
                              {crumb.label}
                            </span>
                          ) : (
                            <Link
                              className="hover:text-foreground cursor-pointer text-xs text-neutral-400 transition-colors"
                              href={crumb.href}
                            >
                              {crumb.label}
                            </Link>
                          )}
                        </span>
                      )
                    })}
                  </>
                )}
              </>
            )
          })()}
        </>
      )}
    </nav>
  )
}
