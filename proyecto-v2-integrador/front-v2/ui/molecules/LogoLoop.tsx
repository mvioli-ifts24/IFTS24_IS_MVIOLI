'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react'

import { Text } from '../atoms/Text'

/* ─────────────────────────────────────────────────────────────
   Tipos públicos
───────────────────────────────────────────────────────────── */

/** Logo renderable como nodo React (ícono SVG u otro componente) */
export interface LogoNodeItem {
  /** Contenido React a renderizar */
  node: ReactNode

  /** Descripción del logo — se usa como `aria-label` y `title` */
  title: string

  /** URL de destino. Acepta rutas absolutas o relativas. */
  href?: string
}

/** Logo renderable como imagen `<img>` */
export interface LogoImageItem {
  /** Ruta de la imagen */
  src: string

  /** Texto alternativo para accesibilidad */
  alt: string

  /** URL de destino. Acepta rutas absolutas o relativas. */
  href?: string
}

/** Ítem de logo: nodo React o imagen */
export type LogoItem = LogoNodeItem | LogoImageItem

/** Dirección de scroll del carrusel */
export type LogoLoopDirection = 'left' | 'right' | 'up' | 'down'

export interface LogoLoopProps {
  /** Array de logos a mostrar en bucle infinito */
  logos: LogoItem[]

  /**
   * Velocidad de desplazamiento en px/s
   * @default 60
   */
  speed?: number

  /**
   * Velocidad de desplazamiento al pasar el cursor en px/s.
   * `0` pausa el carrusel.
   * @default 0
   */
  hoverSpeed?: number

  /**
   * Dirección de desplazamiento
   * @default 'left'
   */
  direction?: LogoLoopDirection

  /**
   * Altura de cada logo en px
   * @default 40
   */
  logoHeight?: number

  /**
   * Espacio entre logos en px
   * @default 48
   */
  gap?: number

  /**
   * Escala el logo con `transform: scale(1.15)` al hacer hover
   * @default false
   */
  scaleOnHover?: boolean

  /**
   * Muestra un degradado en los bordes del carrusel para suavizar la entrada/salida.
   * Requiere que `fadeOutColor` coincida con el color de fondo real del contenedor.
   * @default false
   */
  fadeOut?: boolean

  /**
   * Color de fondo del contenedor usado para el degradado de desvanecimiento.
   * Acepta cualquier valor CSS válido: `'#fff'`, `'var(--background)'`, `'oklch(…)'`.
   * @default 'var(--background)'
   */
  fadeOutColor?: string

  /**
   * `aria-label` del elemento `<nav>` contenedor
   * @default 'Carrusel de logos'
   */
  ariaLabel?: string

  /**
   * Si `false`, ignora el campo `node` y fuerza render de `<img>`.
   * Solo es necesario cuando todos los ítems son `LogoImageItem` y se quiere
   * evitar la rama de render de nodo explícitamente.
   * @default true
   */
  useCustomRender?: boolean

  /**
   * Aplica `dark:invert` a los logos de imagen para adaptarlos al modo oscuro.
   * Indicado cuando las imágenes son logos negros sobre fondo transparente.
   * @default false
   */
  invertOnDark?: boolean

  /** Clases CSS adicionales del contenedor */
  className?: string
}

/* ─────────────────────────────────────────────────────────────
   Guards de tipo
───────────────────────────────────────────────────────────── */

function isImageItem(item: LogoItem): item is LogoImageItem {
  return 'src' in item
}

function isExternalHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://')
}

function logoLabel(item: LogoItem): string {
  return isImageItem(item) ? item.alt : item.title
}

/* ─────────────────────────────────────────────────────────────
   Componente
───────────────────────────────────────────────────────────── */

/**
 * Carrusel de logos con bucle infinito, velocidad configurable
 * y soporte para ítems tipo nodo React o imagen.
 *
 * La animación usa `requestAnimationFrame` para controlar la velocidad
 * en tiempo real (permite cambio suave en hover sin reiniciar la animación).
 *
 * Accesibilidad:
 * - El primer set de logos es accesible (aria-label por ítem).
 * - El set duplicado se oculta con `aria-hidden` y `tabIndex={-1}`.
 *
 * @example
 * ```tsx
 * <LogoLoop
 *   logos={[
 *     { node: <SiReact />, title: 'React', href: 'https://react.dev' },
 *     { src: '/logos/empresa.png', alt: 'Mi empresa' },
 *   ]}
 *   speed={80}
 *   direction="left"
 *   logoHeight={48}
 *   gap={64}
 *   scaleOnHover
 *   fadeOut
 *   fadeOutColor="var(--background)"
 * />
 * ```
 */
export function LogoLoop({
  logos,
  speed = 60,
  hoverSpeed = 0,
  direction = 'left',
  logoHeight = 40,
  gap = 48,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = 'var(--background)',
  invertOnDark = false,
  ariaLabel = 'Carrusel de logos',
  useCustomRender = true,
  className = ''
}: LogoLoopProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const isHoveredRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const isHorizontal = direction === 'left' || direction === 'right'
  const isReverse = direction === 'right' || direction === 'down'

  useEffect(() => {
    const track = trackRef.current

    if (!track || logos.length === 0) return

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp

      const dt = (timestamp - lastTimeRef.current) / 1000

      lastTimeRef.current = timestamp

      const currentSpeed = isHoveredRef.current ? hoverSpeed : speed
      const delta = currentSpeed * dt

      // El track contiene dos copias idénticas → la mitad equivale a un ciclo completo
      const loopSize = isHorizontal ? track.scrollWidth / 2 : track.scrollHeight / 2

      if (loopSize > 0) {
        if (isReverse) {
          posRef.current = (posRef.current - delta + loopSize) % loopSize
        } else {
          posRef.current = (posRef.current + delta) % loopSize
        }

        track.style.transform = isHorizontal
          ? `translateX(-${posRef.current}px)`
          : `translateY(-${posRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
    }
  }, [hoverSpeed, isHorizontal, isReverse, logos.length, speed])

  /* ── Contenido visual de un ítem ──────────────────────────── */

  function renderContent(item: LogoItem) {
    if (isImageItem(item)) {
      return (
        <div
          style={{
            flexShrink: 0,
            height: `${logoHeight}px`,
            position: 'relative',
            width: `${Math.round(logoHeight * 2.5)}px`
          }}
        >
          <Image
            fill
            alt={item.alt}
            className={invertOnDark ? 'object-contain dark:invert' : 'object-contain'}
            sizes={`${Math.round(logoHeight * 2.5)}px`}
            src={item.src}
          />
        </div>
      )
    }

    if (useCustomRender) {
      return (
        <span
          aria-hidden="true"
          style={{ alignItems: 'center', display: 'flex', height: `${logoHeight}px` }}
          title={item.title}
        >
          {item.node}
        </span>
      )
    }

    return null
  }

  /* ── Ítem completo (con o sin link, accesible / duplicado) ── */

  function renderItem(item: LogoItem, key: string, duplicate = false) {
    const label = logoLabel(item)
    const content = renderContent(item)
    const itemStyle: CSSProperties = {
      alignItems: 'center',
      cursor: item.href ? 'pointer' : 'default',
      display: 'flex',
      flexShrink: 0,
      transition: scaleOnHover ? 'transform 0.2s ease' : undefined
    }
    const scaleHandlers = scaleOnHover
      ? {
          onMouseEnter(e: React.MouseEvent<HTMLElement>) {
            ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'
          },
          onMouseLeave(e: React.MouseEvent<HTMLElement>) {
            ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          }
        }
      : {}

    if (item.href) {
      const isExternal = isExternalHref(item.href)
      const sharedProps = {
        'aria-hidden': duplicate || undefined,
        'aria-label': label,
        style: itemStyle,
        tabIndex: duplicate ? -1 : undefined,
        ...scaleHandlers
      }

      return (
        <Link
          key={key}
          href={item.href}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          target={isExternal ? '_blank' : undefined}
          {...sharedProps}
        >
          {content}
        </Link>
      )
    }

    return (
      <Text
        key={key}
        aria-hidden={duplicate || undefined}
        aria-label={label}
        as="span"
        style={itemStyle}
        tabIndex={duplicate ? -1 : undefined}
        {...scaleHandlers}
      >
        {content}
      </Text>
    )
  }

  /* ── Estilos ──────────────────────────────────────────────── */

  const containerStyle: CSSProperties = { overflow: 'hidden', position: 'relative' }

  const trackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    gap: `${gap}px`,
    width: isHorizontal ? 'max-content' : '100%',
    willChange: 'transform'
  }

  const overlayBase: CSSProperties = { pointerEvents: 'none', position: 'absolute', zIndex: 10 }

  const overlayStart: CSSProperties = isHorizontal
    ? {
        ...overlayBase,
        background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
        bottom: 0,
        left: 0,
        top: 0,
        width: '12%'
      }
    : {
        ...overlayBase,
        background: `linear-gradient(to bottom, ${fadeOutColor}, transparent)`,
        height: '12%',
        left: 0,
        right: 0,
        top: 0
      }

  const overlayEnd: CSSProperties = isHorizontal
    ? {
        ...overlayBase,
        background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
        bottom: 0,
        right: 0,
        top: 0,
        width: '12%'
      }
    : {
        ...overlayBase,
        background: `linear-gradient(to top, ${fadeOutColor}, transparent)`,
        bottom: 0,
        height: '12%',
        left: 0,
        right: 0
      }

  return (
    <nav
      aria-label={ariaLabel}
      className={className}
      onMouseEnter={() => {
        isHoveredRef.current = true
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false
      }}
      style={containerStyle}
    >
      {fadeOut && (
        <>
          <div aria-hidden="true" style={overlayStart} />
          <div aria-hidden="true" style={overlayEnd} />
        </>
      )}

      <div ref={trackRef} style={trackStyle}>
        {/* Primer set — accesible */}
        {logos.map((item, i) => renderItem(item, `logo-a-${i}`))}
        {/* Segundo set — oculto a lectores de pantalla */}
        {logos.map((item, i) => renderItem(item, `logo-b-${i}`, true))}
      </div>
    </nav>
  )
}
