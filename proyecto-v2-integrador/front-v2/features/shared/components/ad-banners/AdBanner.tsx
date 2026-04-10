'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { PublicService } from '@/features/shared/services/public.service'
import { type Banner } from '@/features/shared/types/media.types'
import { Button } from '@/ui'

const DURATION_H = 8000
const DURATION_V = 6000
const PEEK = 48
const SLIDE_GAP = 12

export type AdBannerProps = {
  className?: string
  mode?: 'carousel' | 'card'
  orientation: 'horizontal' | 'vertical'
}

export function AdBanner({ className, mode = 'carousel', orientation }: AdBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  // virtualIdx: 0 = clon del último, 1..N = slides reales, N+1 = clon del primero
  const [virtualIdx, setVirtualIdx] = useState(1)
  const [noTransition, setNoTransition] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Índice real (0-based) derivado del virtual
  const realIdx =
    banners.length === 0
      ? 0
      : virtualIdx <= 0
        ? banners.length - 1
        : virtualIdx >= banners.length + 1
          ? 0
          : Math.min(virtualIdx - 1, banners.length - 1)

  useEffect(() => {
    PublicService.getBanners().then(res => {
      if (res.data) {
        const filtered = res.data.filter(b =>
          orientation === 'horizontal' ? b.image_url_horizontal : b.image_url_vertical
        )

        setBanners(filtered)
        setVirtualIdx(1)
      }
    })
  }, [orientation])

  useEffect(() => {
    if (orientation !== 'horizontal') return

    const el = containerRef.current

    if (!el) return

    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width)
    })

    ro.observe(el)

    return () => ro.disconnect()
  }, [orientation, banners.length])

  // Vuelve a habilitar la transición luego del snap sin animación
  useEffect(() => {
    if (!noTransition) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false)))

    return () => cancelAnimationFrame(id)
  }, [noTransition])

  // Auto-avance
  useEffect(() => {
    if (banners.length === 0) return

    const DURATION = orientation === 'horizontal' ? DURATION_H : DURATION_V
    const timer = setTimeout(() => {
      setVirtualIdx(v => {
        // Vertical / card: ciclo simple 1..N sin clones
        if (!(orientation === 'horizontal' && mode === 'carousel')) {
          const next = v + 1

          return next > banners.length ? 1 : next
        }

        // Carousel horizontal: avanza al clon; transitionEnd hará el snap
        return v + 1
      })
    }, DURATION)

    return () => clearTimeout(timer)
  }, [virtualIdx, banners.length, orientation, mode])

  // Snap post-animación para el loop infinito
  const handleTransitionEnd = useCallback(() => {
    if (banners.length <= 1) return
    if (virtualIdx <= 0) {
      setNoTransition(true)
      setVirtualIdx(banners.length)
    } else if (virtualIdx >= banners.length + 1) {
      setNoTransition(true)
      setVirtualIdx(1)
    }
  }, [virtualIdx, banners.length])

  if (banners.length === 0) return null

  // ── HORIZONTAL card (inline feed) ──────────────────────────────────────
  if (orientation === 'horizontal' && mode === 'card') {
    const banner = banners[realIdx]
    const imgUrl = banner.image_url_horizontal

    if (!imgUrl) return null

    const card = (
      <div
        className={`relative overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800${className ? ` ${className}` : ''}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={banner.name} className="block aspect-4/1 w-full object-cover" src={imgUrl} />
        <span className="absolute top-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] leading-none text-white/70">
          Publicidad de muestra (no real)
        </span>
        <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/20">
          <div
            key={realIdx}
            className="h-full bg-white/60"
            style={{ animation: `fill-progress ${DURATION_H}ms linear forwards` }}
          />
        </div>
      </div>
    )

    return banner.link ? (
      <a href={banner.link} rel="noopener noreferrer" target="_blank">
        {card}
      </a>
    ) : (
      card
    )
  }

  // ── HORIZONTAL carousel (loop infinito con clones) ──────────────────────
  if (orientation === 'horizontal') {
    // Array extendido: [clon del último, ...slides reales, clon del primero]
    const extended =
      banners.length > 1 ? [banners[banners.length - 1], ...banners, banners[0]] : [...banners]

    const slideWidth = containerWidth > 0 ? containerWidth - 2 * PEEK : 0
    const translateX = containerWidth > 0 ? PEEK - virtualIdx * (slideWidth + SLIDE_GAP) : 0

    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-xl${className ? ` ${className}` : ''}`}
      >
        {containerWidth > 0 && (
          <div
            className={`flex h-full${noTransition ? '' : 'transition-transform duration-500 ease-in-out'}`}
            onTransitionEnd={handleTransitionEnd}
            style={{ gap: `${SLIDE_GAP}px`, transform: `translateX(${translateX}px)` }}
          >
            {extended.map((b, i) => {
              if (!b.image_url_horizontal) return null

              const isActive = i === virtualIdx
              const content = (
                <>
                  <Image
                    alt={b.name}
                    className="block h-full w-full object-cover"
                    height={200}
                    loading="eager"
                    src={b.image_url_horizontal}
                    width={800}
                  />
                  <span className="absolute top-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] leading-none text-white/70">
                    Publicidad de muestra (no real)
                  </span>
                </>
              )

              const sharedClass = `relative h-full shrink-0 overflow-hidden rounded-lg transition-opacity duration-300${isActive ? '' : ' opacity-50'}`

              return b.link ? (
                <a
                  key={i}
                  className={`block ${sharedClass}`}
                  href={b.link}
                  rel="noopener noreferrer"
                  style={{ width: `${slideWidth}px` }}
                  target="_blank"
                >
                  {content}
                </a>
              ) : (
                <div key={i} className={sharedClass} style={{ width: `${slideWidth}px` }}>
                  {content}
                </div>
              )
            })}
          </div>
        )}

        {banners.length > 1 && (
          <>
            <Button
              aria-label="Banner anterior"
              className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full! py-2.5"
              color="muted"
              iconLeft={CaretLeftIcon}
              onClick={() => setVirtualIdx(v => v - 1)}
              size="xs"
              variant="filled"
            />
            <Button
              aria-label="Banner siguiente"
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full! py-2.5"
              color="muted"
              iconLeft={CaretRightIcon}
              onClick={() => setVirtualIdx(v => v + 1)}
              size="xs"
              variant="filled"
            />
          </>
        )}
      </div>
    )
  }

  // ── VERTICAL con barra de progreso ──────────────────────────────────────
  const banner = banners[realIdx]
  const imgUrl = banner.image_url_vertical

  if (!imgUrl) return null

  const card = (
    <div
      className={`relative overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800${className ? ` ${className}` : ''}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={banner.name} className="block aspect-1/2 w-full object-cover" src={imgUrl} />
      <span className="absolute top-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] leading-none text-white/70">
        Publicidad de muestra (no real)
      </span>
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/20">
        <div
          key={realIdx}
          className="h-full bg-white/60"
          style={{ animation: `fill-progress ${DURATION_V}ms linear forwards` }}
        />
      </div>
    </div>
  )

  return banner.link ? (
    <a href={banner.link} rel="noopener noreferrer" target="_blank">
      {card}
    </a>
  ) : (
    card
  )
}
