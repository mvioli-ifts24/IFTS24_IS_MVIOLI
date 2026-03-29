import { Skeleton } from './Skeleton'

export interface PageSkeletonProps {
  /** Clases CSS adicionales para el contenedor */
  className?: string
}

export function PageSkeleton({ className = '' }: PageSkeletonProps) {
  return (
    <section className={`mx-auto w-full max-w-5xl ${className}`.trim()}>
      <Skeleton className="mb-4 h-8 w-1/3 rounded" />
      <Skeleton className="mb-6 h-6 w-1/4 rounded" />
    </section>
  )
}
