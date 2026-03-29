'use client'

import { useEffect, useState } from 'react'

/**
 * Props para el contador animado
 */
export interface AnimatedCounterProps {
  /**
   * Número final al que contar
   */
  targetNumber: number

  /**
   * Duración de la animación en milisegundos
   * @default 2000
   */
  duration?: number

  /**
   * Sufijo del número (ej: "K+", "+")
   */
  suffix?: string

  /**
   * Número de decimales a mostrar
   * @default 0
   */
  decimals?: number
}

/**
 * Componente de Contador Animado
 *
 * Anima un número desde 0 hasta el targetNumber
 * Útil para mostrar estadísticas
 */
export function AnimatedCounter({
  targetNumber,
  duration = 2000,
  suffix = '',
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrameId: number

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cúbico para animación más natural
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const factor = Math.pow(10, decimals)
      const currentCount = Math.floor(targetNumber * easedProgress * factor) / factor

      setCount(currentCount)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [targetNumber, duration, decimals])

  return (
    <span style={{ willChange: 'contents' }}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}
