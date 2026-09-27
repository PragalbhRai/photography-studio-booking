import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { packagesApi, queryKeys } from '@/lib/endpoints'
import { formatDuration, formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { PageState, Skeleton } from '@/components/ui/States'
import { ClientReviewsSection } from '@/components/reviews/ClientReviewsSection'

export const Route = createFileRoute('/packages/$packageId')({
  component: PackageDetailPage,
})

function PackageDetailPage() {
  const { packageId } = Route.useParams()
  const query = useQuery({
    queryKey: queryKeys.package(packageId),
    queryFn: () => packagesApi.get(packageId),
  })

  if (query.isLoading) {
    return (
      <div className="mx-auto grid max-w-site gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
        <Skeleton className="min-h-[520px]" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-site px-5 py-24 md:px-8">
        <PageState
          title="Something went wrong. Please try again."
          body="This package could not be loaded."
          action={
            <Link to="/packages">
              <Button variant="secondary">Back to packages</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const pkg = query.data

  return (
    <div className="mx-auto max-w-site px-5 py-16 md:px-8 md:py-24">
      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="img-zoom aspect-[4/5]">
          <Photo src={pkg.image_url} alt={pkg.name} />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass">{pkg.category}</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">{pkg.name}</h1>
          <p className="mt-6 text-lg leading-relaxed text-mute">{pkg.description}</p>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-8">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-mute">Investment</dt>
              <dd className="mt-2 font-display text-4xl">{formatPrice(pkg.price)}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-mute">Duration</dt>
              <dd className="mt-2 font-display text-4xl">{formatDuration(pkg.duration_minutes)}</dd>
            </div>
          </dl>
          <Link to="/book" search={{ packageId: pkg.id }} className="mt-10 inline-block">
            <Button size="lg">Book this package</Button>
          </Link>
        </div>
      </div>

      {/* Verified Client Reviews for this Offering */}
      <ClientReviewsSection
        categoryFilter={pkg.category}
        title={`Verified Reviews · ${pkg.name}`}
        subtitle={`Client testimonials and impressions from patrons who commissioned our ${pkg.name} sitting.`}
      />
    </div>
  )
}
