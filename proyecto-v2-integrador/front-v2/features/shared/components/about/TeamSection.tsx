import { type Icon } from '@phosphor-icons/react'
import {
  GithubLogoIcon,
  GlobeSimpleIcon,
  LinkedinLogoIcon,
  MapPinIcon
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'

import { CardWrapper, Heading, Text } from '@/ui'

// ── Datos ──────────────────────────────────────────────────────────────────

type SocialItem = { href: string; icon: Icon; label: string }

const TEAM: { name: string; role: string; photo: string; links: SocialItem[] }[] = [
  {
    name: 'Natalia Camila Vega',
    role: 'Developer',
    photo: '/team/natalia.jpeg',
    links: [
      {
        href: 'https://www.linkedin.com/in/nataliacamilavega/',
        icon: LinkedinLogoIcon,
        label: 'LinkedIn'
      },
      { href: 'https://github.com/nataliaVega', icon: GithubLogoIcon, label: 'GitHub' },
      {
        href: 'https://nataliavega-portfolio.vercel.app/',
        icon: GlobeSimpleIcon,
        label: 'Portfolio'
      }
    ]
  },
  {
    name: 'Martín Violi',
    role: 'Developer',
    photo: '/team/martin.jpeg',
    links: [
      {
        href: 'https://www.linkedin.com/in/martinviolidev/',
        icon: LinkedinLogoIcon,
        label: 'LinkedIn'
      },
      { href: 'https://github.com/martinvioli', icon: GithubLogoIcon, label: 'GitHub' },
      { href: 'https://martinvioli.vercel.app/', icon: GlobeSimpleIcon, label: 'Portfolio' }
    ]
  }
]

const INSTITUTE = {
  name: 'Instituto de Formación Técnica Superior N° 24',
  label: 'Informática — Buenos Aires, Argentina',
  description:
    'RANK es un proyecto final desarrollado por estudiantes de la Tecnicatura Superior en Desarrollo de Software.',
  logo: '/team/ifts24.gif',
  links: [
    { href: 'https://www.ifts24.edu.ar/', icon: GlobeSimpleIcon, label: 'Sitio Web' },
    {
      href: 'https://share.google/yGiXUchpwdJC0c4zN',
      icon: MapPinIcon,
      label: 'Av. Entre Ríos 757, CABA'
    }
  ] satisfies SocialItem[]
}

// ── Componentes ────────────────────────────────────────────────────────────

function SocialLink({ href, icon: IconComponent, label }: SocialItem) {
  return (
    <a
      aria-label={label}
      className="text-foreground/60 hover:text-foreground/90 inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <IconComponent size={18} weight="fill" />
    </a>
  )
}

function SocialLinks({ links }: { links: SocialItem[] }) {
  return (
    <div className="flex items-center gap-4">
      {links.map(link => (
        <SocialLink key={link.label} {...link} />
      ))}
    </div>
  )
}

function DeveloperCard({ developer: dev }: { developer: (typeof TEAM)[number] }) {
  return (
    <CardWrapper className="flex items-center gap-6" elevation="1" padding="lg">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
        <Image fill alt={dev.name} className="object-cover" sizes="96px" src={dev.photo} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="space-y-1">
          <Heading level="h3" size="sm" variant="primary">
            {dev.name}
          </Heading>
          <Text variant="label">{dev.role}</Text>
        </div>
        <SocialLinks links={dev.links} />
      </div>
    </CardWrapper>
  )
}

// ── Team Section ───────────────────────────────────────────────────────────

export function TeamSection() {
  return (
    <section className="w-full max-w-6xl px-6 py-20 lg:px-16" id="sobrenosotros">
      <div className="mb-12 text-center">
        <Text color="muted" size="m" variant="label">
          Sobre nosotros
        </Text>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {TEAM.map(dev => (
          <DeveloperCard key={dev.name} developer={dev} />
        ))}
      </div>

      <CardWrapper
        className="flex flex-col items-center gap-6 sm:flex-row"
        elevation="1"
        padding="lg"
      >
        <Image
          alt={`Logo ${INSTITUTE.name}`}
          className="overflow-hidden rounded-lg object-cover"
          height={416}
          src={INSTITUTE.logo}
          width={240}
        />
        <div className="flex min-w-0 flex-1 flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <div className="space-y-1">
            <Heading level="h3" size="sm" variant="primary">
              {INSTITUTE.name}
            </Heading>
            <Text variant="label">{INSTITUTE.label}</Text>
          </div>
          <SocialLinks links={INSTITUTE.links} />
        </div>
      </CardWrapper>
    </section>
  )
}
