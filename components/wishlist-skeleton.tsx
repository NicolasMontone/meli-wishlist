export function WishlistSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: there is no other way
            key={i}
            className="overflow-hidden rounded-lg border bg-card shadow-lg"
          >
            <div className="aspect-[4/3] w-full bg-muted animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
