'use client'

import { useTheme } from 'next-themes'
import {
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

/**
 * Componente inspirado en BorderGlow de React Bits.
 *
 * Nota:
 * - Esta implementación NO es una copia 1:1.
 * - Está adaptada al sistema de diseño del proyecto y a Tailwind para un uso opcional
 *   para evitar volver cliente a wrappers base como CardWrapper.
 *
 * Referencia de codigo: https://www.reactbits.dev/
 */

export interface CardBorderGlowProps {
  children: ReactNode
  className?: string
  /**
   * Radio de borde en px
   * @default 24
   */
  borderRadius?: number
  /**
   * Distancia exterior del halo en px
   * @default 40
   */
  glowRadius?: number
  /**
   * Sensibilidad de borde (escala 0-100)
   * @default 30
   */
  edgeSensitivity?: number
  /**
   * Color del brillo. Acepta HSL simplificado (h s l) o color CSS (ej: var(--primary-300)).
   * @default 'var(--primary-300)'
   */
  glowColor?: string
  /**
   * Apertura del cono de luz
   * @default 26
   */
  coneSpread?: number
  /**
   * Color de fondo base de la card
   * @default 'var(--neutral-50)'
   */
  backgroundColor?: string
  /**
   * Intensidad del glow
   * @default 1
   */
  glowIntensity?: number
  /**
   * Colores del mesh gradient
   * @default ['var(--primary-300)', 'var(--secondary-300)', 'var(--primary-400)']
   */
  colors?: string[]
  /**
   * Opacidad del relleno interno del efecto
   * @default 0.5
   */
  fillOpacity?: number
  /**
   * Barrido inicial automático
   * @default false
   */
  animated?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } | null {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)

  if (!match) return null

  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3])
  }
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const parsed = parseHSL(glowColor)
  const base = parsed ? `${parsed.h}deg ${parsed.s}% ${parsed.l}%` : null
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false]
  ]

  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const opacity = Math.min(alpha * intensity, 100)
      const color = base ? `hsl(${base} / ${opacity}%)` : glowColor

      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}`
    })
    .join(', ')
}

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%'
]
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = []
  const safeColors = colors.length
    ? colors
    : ['var(--primary-300)', 'var(--secondary-300)', 'var(--primary-400)']

  for (let i = 0; i < 7; i += 1) {
    const color = safeColors[Math.min(COLOR_MAP[i], safeColors.length - 1)]

    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${color} 0px, transparent 50%)`)
  }

  gradients.push(`linear-gradient(${safeColors[0]} 0 100%)`)

  return gradients
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3)
}

function easeInCubic(x: number) {
  return x * x * x
}

interface AnimateOpts {
  start?: number
  end?: number
  duration?: number
  delay?: number
  ease?: (t: number) => number
  onUpdate: (v: number) => void
  onEnd?: () => void
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd
}: AnimateOpts) {
  const t0 = performance.now() + delay
  const timeoutId = window.setTimeout(() => {
    const tick = () => {
      const elapsed = performance.now() - t0
      const t = Math.min(elapsed / duration, 1)

      onUpdate(start + (end - start) * ease(t))
      if (t < 1) requestAnimationFrame(tick)
      else onEnd?.()
    }

    requestAnimationFrame(tick)
  }, delay)

  return () => {
    window.clearTimeout(timeoutId)
  }
}

export function CardBorderGlow({
  children,
  className = '',
  borderRadius,
  glowRadius,
  edgeSensitivity,
  glowColor,
  coneSpread,
  backgroundColor,
  glowIntensity,
  colors,
  fillOpacity,
  animated = false
}: CardBorderGlowProps) {
  const { resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    function handleMount() {
      try {
        setIsMounted(true)
      } catch (error) {
        console.error('Error al montar CardBorderGlow:', error)
      }
    }
    handleMount()
  }, [])

  const isDark = isMounted ? resolvedTheme === 'dark' : false

  const safeBorderRadius = borderRadius ?? 28
  const safeGlowRadius = glowRadius ?? (isDark ? 40 : 38)
  const safeEdgeSensitivity = edgeSensitivity ?? (isDark ? 30 : 30)
  const safeGlowColor =
    glowColor ??
    (isDark
      ? 'var(--primary-300)'
      : 'color-mix(in oklab, var(--primary-300) 55%, var(--secondary-300) 45%)')
  const safeConeSpread = coneSpread ?? 25
  const safeBackgroundColor =
    backgroundColor ?? (isDark ? 'var(--neutral-50)' : 'var(--background)')
  const safeGlowIntensity = glowIntensity ?? (isDark ? 1 : 0.95)
  const safeColors =
    colors ??
    (isDark
      ? ['var(--primary-300)', 'var(--secondary-300)', 'var(--primary-400)']
      : ['var(--primary-300)', 'var(--secondary-300)', 'var(--primary-400)'])
  const safeFillOpacity = fillOpacity ?? (isDark ? 0.5 : 0.42)

  const rootRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [cursorAngle, setCursorAngle] = useState(45)
  const [edgeProximity, setEdgeProximity] = useState(0)
  const [sweepActive, setSweepActive] = useState(false)

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect()

    return [width / 2, height / 2] as const
  }, [])

  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el)
      const dx = x - cx
      const dy = y - cy
      let kx = Number.POSITIVE_INFINITY
      let ky = Number.POSITIVE_INFINITY

      if (dx !== 0) kx = cx / Math.abs(dx)
      if (dy !== 0) ky = cy / Math.abs(dy)

      return clamp(1 / Math.min(kx, ky), 0, 1)
    },
    [getCenterOfElement]
  )

  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el)
      const dx = x - cx
      const dy = y - cy

      if (dx === 0 && dy === 0) return 0
      const radians = Math.atan2(dy, dx)
      let degrees = radians * (180 / Math.PI) + 90

      if (degrees < 0) degrees += 360

      return degrees
    },
    [getCenterOfElement]
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const node = rootRef.current

      if (!node) return

      const rect = node.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setEdgeProximity(getEdgeProximity(node, x, y))
      setCursorAngle(getCursorAngle(node, x, y))
    },
    [getCursorAngle, getEdgeProximity]
  )

  useEffect(() => {
    if (!animated) return

    const angleStart = 110
    const angleEnd = 465
    const startRaf = requestAnimationFrame(() => {
      setSweepActive(true)
      setCursorAngle(angleStart)
    })

    const stopEdgeIn = animateValue({
      duration: 500,
      onUpdate: value => setEdgeProximity(value / 100)
    })

    const stopAngleMid = animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: value => {
        setCursorAngle((angleEnd - angleStart) * (value / 100) + angleStart)
      }
    })

    const stopAngleOut = animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: value => {
        setCursorAngle((angleEnd - angleStart) * (value / 100) + angleStart)
      }
    })

    const stopEdgeOut = animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: value => setEdgeProximity(value / 100),
      onEnd: () => setSweepActive(false)
    })

    return () => {
      cancelAnimationFrame(startRaf)
      stopEdgeIn()
      stopAngleMid()
      stopAngleOut()
      stopEdgeOut()
    }
  }, [animated])

  const isVisible = isHovered || sweepActive
  const borderOpacityDynamic = isVisible
    ? Math.max(
        0,
        (edgeProximity * 100 - (safeEdgeSensitivity + 20)) / (100 - (safeEdgeSensitivity + 20))
      )
    : 0
  const glowOpacityDynamic = isVisible
    ? Math.max(0, (edgeProximity * 100 - safeEdgeSensitivity) / (100 - safeEdgeSensitivity))
    : 0
  const borderOpacity = isDark ? borderOpacityDynamic : Math.max(0.28, borderOpacityDynamic)
  const glowOpacity = isDark ? glowOpacityDynamic : Math.max(0.2, glowOpacityDynamic)

  const meshGradients = buildMeshGradients(safeColors)
  const borderBg = meshGradients.map(gradient => `${gradient} border-box`)
  const fillBg = meshGradients.map(gradient => `${gradient} padding-box`)
  const angleDeg = `${cursorAngle.toFixed(3)}deg`

  return (
    <div
      ref={rootRef}
      className={`relative isolate grid max-w-full border ${className}`.trim()}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerMove={handlePointerMove}
      style={{
        background: safeBackgroundColor,
        borderColor: isDark
          ? 'color-mix(in oklab, var(--foreground) 14%, transparent)'
          : 'var(--primary-300)',
        borderRadius: `${safeBorderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        boxShadow: isDark
          ? 'rgba(0,0,0,0.10) 0 1px 2px, rgba(0,0,0,0.10) 0 2px 4px, rgba(0,0,0,0.10) 0 4px 8px, rgba(0,0,0,0.10) 0 8px 16px, rgba(0,0,0,0.10) 0 16px 32px, rgba(0,0,0,0.10) 0 32px 64px'
          : 'color-mix(in oklab, var(--primary-300) 18%, transparent) 0 2px 8px, color-mix(in oklab, var(--secondary-300) 22%, transparent) 0 12px 28px, color-mix(in oklab, var(--primary-400) 20%, transparent) 0 18px 44px'
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-1 rounded-[inherit]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${safeBackgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg
          ].join(', '),
          opacity: borderOpacity,
          maskImage: `conic-gradient(from ${angleDeg} at center, black ${safeConeSpread}%, transparent ${safeConeSpread + 15}%, transparent ${100 - safeConeSpread - 15}%, black ${100 - safeConeSpread}%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${safeConeSpread}%, transparent ${safeConeSpread + 15}%, transparent ${100 - safeConeSpread - 15}%, black ${100 - safeConeSpread}%)`,
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out'
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 -z-1 rounded-[inherit]"
        style={
          {
            border: '1px solid transparent',
            background: fillBg.join(', '),
            maskImage: [
              'linear-gradient(to bottom, black, black)',
              'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
              'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
              `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`
            ].join(', '),
            WebkitMaskImage: [
              'linear-gradient(to bottom, black, black)',
              'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
              'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
              'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
              `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`
            ].join(', '),
            maskComposite: 'subtract, add, add, add, add, add',
            WebkitMaskComposite:
              'source-out, source-over, source-over, source-over, source-over, source-over',
            opacity: borderOpacity * safeFillOpacity,
            mixBlendMode: isDark ? 'soft-light' : 'screen',
            transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out'
          } as CSSProperties
        }
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-1 rounded-[inherit]"
        style={
          {
            inset: `${-safeGlowRadius}px`,
            maskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
            WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
            opacity: glowOpacity,
            mixBlendMode: isDark ? 'plus-lighter' : 'screen',
            transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out'
          } as CSSProperties
        }
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${safeGlowRadius}px`,
            boxShadow: buildBoxShadow(safeGlowColor, safeGlowIntensity)
          }}
        />
      </span>

      <div className="relative z-1 flex min-w-0 flex-col overflow-auto">{children}</div>
    </div>
  )
}
