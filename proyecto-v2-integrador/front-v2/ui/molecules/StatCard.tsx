'use client'

import { type Icon } from '@phosphor-icons/react'
import Link from 'next/link'
import { type MouseEvent, type ReactNode, useRef, useState } from 'react'

import { CardWrapper } from '../atoms/CardWrapper'
import { Text } from '../atoms/Text'

export type StatCardAccent = 1 | 2 | 3 | 4 | 5

export type StatCardProps = {
  icon: Icon
  label: string
  value: number
  href?: string
  /** Nivel visual del acento (1 = más sutil → 5 = más intenso). Sin significado semántico. */
  accent?: StatCardAccent
}

const accentClasses: Record<StatCardAccent, string> = {
  1: 'text-primary-300',
  2: 'text-primary-400',
  3: 'text-secondary-300',
  4: 'text-secondary-400',
  5: 'text-primary-400'
}

const spotlightColors: Record<StatCardAccent, string> = {
  1: 'var(--primary-300)',
  2: 'var(--primary-400)',
  3: 'var(--secondary-300)',
  4: 'var(--secondary-400)',
  5: 'color-mix(in oklab, var(--primary-400) 60%, var(--secondary-300) 40%)'
}

function SpotlightWrapper({
  children,
  accent,
  className
}: {
  children: ReactNode
  accent: NonNullable<StatCardProps['accent']>
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()

    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={ref}
      className={['relative overflow-hidden', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setOpacity(0.3)}
      onMouseLeave={() => setOpacity(0)}
      onMouseMove={handleMouseMove}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          background: `radial-gradient(circle at ${pos.x}px ${pos.y}px, color-mix(in oklab, ${spotlightColors[accent]} 40%, transparent), transparent 75%)`,
          opacity
        }}
      />
      {children}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, href, accent = 1 }: StatCardProps) {
  const inner = (
    <CardWrapper
      className={[
        'flex min-w-40 flex-1 flex-col gap-2',
        href ? 'cursor-pointer transition-shadow duration-200 hover:shadow-md' : ''
      ]
        .join(' ')
        .trim()}
      elevation="0"
      padding="none"
    >
      <SpotlightWrapper accent={accent} className="flex h-full gap-4 p-4">
        <span
          className={`${accentClasses[accent]} h-fit w-fit rounded-sm p-3`}
          style={{
            backgroundColor: `color-mix(in oklab, ${spotlightColors[accent]} 20%, transparent)`
          }}
        >
          <Icon size={24} weight="regular" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2" title={label}>
          <Text className="line-clamp-2 w-full truncate" size="2xs" variant="label">
            {label}
          </Text>
          <span className="text-foreground text-2xl leading-none font-bold">{value}</span>
        </div>
      </SpotlightWrapper>
    </CardWrapper>
  )

  if (href) {
    return (
      <Link className="min-w-40 flex-1" href={href}>
        {inner}
      </Link>
    )
  }

  return inner
}
