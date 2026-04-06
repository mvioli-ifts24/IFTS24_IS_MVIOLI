import { notFound } from 'next/navigation'

import { ProfilePage } from '@/features/profile/pages/ProfilePage'

interface Props {
  params: Promise<{ email: string }>
}

export default async function ProfileEmailPage({ params }: Props) {
  const { email } = await params

  if (/^\d+$/.test(email)) {
    notFound()
  }

  return <ProfilePage email={email} />
}
