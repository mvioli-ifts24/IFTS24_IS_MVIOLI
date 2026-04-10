import { AdBanner } from '@/features/shared/components/ad-banners/AdBanner'
import { Text } from '@/ui'

// ── Banners Section ────────────────────────────────────────────────────────

export function BannersSection() {
  return (
    <section className="w-full max-w-6xl px-6 py-16 lg:px-16" id="banners">
      <div className="mb-10 text-center">
        <Text color="muted" size="m" variant="label">
          Descuentos y beneficios exclusivos
        </Text>
      </div>

      <AdBanner orientation="horizontal" />
    </section>
  )
}
