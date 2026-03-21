import { Text } from '@/components'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-linear-to-b from-neutral-100 to-neutral-200 py-16 dark:border-neutral-800 dark:from-neutral-900/50 dark:to-neutral-900">
      <div className="container mx-auto px-4">
        {/* Bottom Info */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Text size="xs" variant="muted">
            © {currentYear} <span className="font-semibold">RANK.</span> Todos los derechos
            reservados.
          </Text>
          <Text size="xs" variant="muted">
            Construido con Next.js • Tailwind CSS • TypeScript
          </Text>
        </div>
      </div>
    </footer>
  )
}
