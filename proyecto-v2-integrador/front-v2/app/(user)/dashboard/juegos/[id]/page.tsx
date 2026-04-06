import { GameDetailPage } from '@/features/explorer/pages/GameDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params

  return <GameDetailPage gameId={Number(id)} />
}
