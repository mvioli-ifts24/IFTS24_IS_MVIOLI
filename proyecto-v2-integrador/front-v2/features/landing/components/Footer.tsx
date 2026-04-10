import { Logo, Separator, Text } from '@/ui'

const LINKS_DE_INTERES = [
  { label: 'Inicio', href: '/#hero' },
  { label: 'Estadísticas', href: '/#stats' },
  { label: 'Sponsors', href: '/#sponsors' },
  { label: 'Sobre Nosotros', href: '/#team' }
]

const AUTH_LINKS = [
  { label: 'Iniciar Sesión', href: '/login' },
  { label: 'Registrarse', href: '/register' }
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="w-full border-t border-neutral-200 bg-neutral-50 px-6 py-12 lg:px-16 dark:border-neutral-800 dark:bg-neutral-950"
      id="footer"
    >
      {/* Grid principal */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Columna marca */}
        <div className="flex flex-col gap-4 md:col-span-1">
          <Logo />
          <Text color="muted" size="xs">
            Reseñas de juegos escritas por la comunidad.
          </Text>
          <Text color="muted" size="xs">
            Proyecto Final — IFTS N° 24
          </Text>
        </div>

        {/* Columna navegación */}
        <div className="flex flex-col gap-3">
          <Text size="xs" weight="semibold">
            NAVEGACIÓN
          </Text>
          {LINKS_DE_INTERES.map(link => (
            <a
              key={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Columna acceso */}
        <div className="flex flex-col gap-3">
          <Text size="xs" weight="semibold">
            ACCESO
          </Text>
          {AUTH_LINKS.map(link => (
            <a
              key={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <a
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            href="https://www.ifts24.edu.ar/"
            rel="noopener noreferrer"
            target="_blank"
          >
            IFTS N° 24
          </a>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Copyright */}
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <Text className="inline-flex items-center gap-1" color="muted" size="xs">
          © {currentYear} <Logo standalone size="2xs" /> Todos los derechos reservados.
        </Text>
        <Text color="muted" size="xs">
          Desarrollado por Natalia Vega &amp; Martín Violi · IFTS N° 24
        </Text>
      </div>
    </footer>
  )
}
