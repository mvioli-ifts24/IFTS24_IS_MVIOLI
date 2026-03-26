export function PageSkeleton() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="h-32 animate-pulse rounded-xl bg-neutral-100 p-6" />
      <div className="h-64 animate-pulse rounded-xl bg-neutral-100 p-6" />
    </section>
  )
}
