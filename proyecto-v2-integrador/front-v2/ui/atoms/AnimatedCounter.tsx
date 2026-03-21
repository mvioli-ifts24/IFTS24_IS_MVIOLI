'use client'

import { useEffect, useState } from 'react'

/**
 * Props para el contador animado
 */
interface AnimatedCounterProps {
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

      // Easing function para animación más natural (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const currentCount =
        Math.floor(targetNumber * easedProgress * Math.pow(10, decimals)) / Math.pow(10, decimals)

      setCount(currentCount)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [targetNumber, duration, decimals])

  return (
    <>
      {count.toFixed(decimals)}
      {suffix}
    </>
  )
}
