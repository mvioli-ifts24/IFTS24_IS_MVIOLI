import { TeamSection } from '@/features/shared/components/about/TeamSection'

import { BannersSection } from '../components/BannersSection'
import { HeroSection } from '../components/HeroSection'
import { SponsorsSection } from '../components/SponsorsSection'
import { StatsSection } from '../components/StatsSection'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <SponsorsSection />
      <BannersSection />
      <TeamSection />
    </>
  )
}
