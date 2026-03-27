import { ProfileCard } from '../components/profile-details/ProfileCard'
import { ReviewerSections } from '../components/reviews/ReviewerSections'
import { AccountSettings } from '../components/settings/AccountSettings'

export function ProfilePage() {
  return (
    <>
      <ProfileCard />
      <ReviewerSections />
      <AccountSettings />
    </>
  )
}
