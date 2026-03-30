import { Text } from '@/ui/atoms/Text'

// Equivalente al comportamiento por defecto de renderCell en TableBody.
// Usarla explícitamente cuando se necesite claridad o composición en la columna.
export function TextCell({ value }: { value?: string | null }) {
  if (value === null || value === undefined) {
    return (
      <Text color="muted" size="sm">
        —
      </Text>
    )
  }

  return (
    <Text size="sm" weight="medium">
      {value}
    </Text>
  )
}

export function LinkCell({ href }: { href?: string | null }) {
  if (!href) {
    return (
      <Text color="muted" size="sm">
        —
      </Text>
    )
  }

  return (
    <a
      className="text-primary text-sm underline underline-offset-2"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {href}
    </a>
  )
}
