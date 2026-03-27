import { Skeleton } from './Skeleton'

export function PageSkeleton() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <Skeleton className="mb-4 h-8 w-1/3 rounded" />
      <Skeleton className="mb-6 h-6 w-1/4 rounded" />
    </section>
  )
}
