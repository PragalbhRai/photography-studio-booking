import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { photographersApi, queryKeys } from '@/lib/endpoints'
import { portraitForId } from '@/lib/images'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { PageState, Skeleton } from '@/components/ui/States'
import { PackageCard } from '@/components/packages/PackageCard'
import { KitbagShowcase } from '@/components/photographers/KitbagShowcase'
import { ClientReviewsSection } from '@/components/reviews/ClientReviewsSection'

export const Route = createFileRoute('/photographers/$photographerId')({
  component: PhotographerDetailPage,
})

function PhotographerDetailPage() {
  const { photographerId } = Route.useParams()
  const query = useQuery({
    queryKey: queryKeys.photographer(photographerId),
    queryFn: () => photographersApi.get(photographerId),
  })

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-site space-y-8 px-5 py-16 md:px-8">
        <Skeleton className="h-[60vh]" />
        <Skeleton className="h-24" />
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-site px-5 py-24 md:px-8">
        <PageState
          title="Something went wrong. Please try again."
          body="This photographer could not be loaded."
          action={
            <Link to="/photographers">
              <Button variant="secondary">Back to photographers</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const p = query.data
  const hero = portraitForId(p.id, p.full_name) || p.portfolio_images[0]?.image_url

  return (
    <div>
      <section className="relative min-h-[70vh] overflow-hidden">
        <Photo src={hero} alt={p.full_name} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-site px-5 pb-12 md:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
            {p.specialties.join(' · ') || 'Photographer'}
          </p>
          <h1 className="mt-3 font-display text-5xl text-cream md:text-7xl">{p.full_name}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-site px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <p className="max-w-2xl text-lg leading-relaxed text-mute">{p.bio || 'A Northlight photographer.'}</p>
          <div className="flex md:justify-end">
            <Link to="/book" search={{ photographerId: p.id }}>
              <Button size="lg">Book with {p.full_name.split(' ')[0]}</Button>
            </Link>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="font-display text-4xl">Portfolio</h2>
          {!Array.isArray(p.portfolio_images) || p.portfolio_images.length === 0 ? (
            <p className="mt-6 text-mute">Nothing available yet.</p>
          ) : (
            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {p.portfolio_images.map((img, i) => (
                <figure key={img.id} className="img-zoom mb-4 break-inside-avoid" style={{ aspectRatio: i % 3 === 0 ? '3/4' : '4/5' }}>
                  <Photo src={img.image_url} alt={img.caption || `${p.full_name} portfolio`} />
                  {img.caption ? (
                    <figcaption className="mt-2 text-xs uppercase tracking-[0.14em] text-mute">{img.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          )}
        </section>

        <section className="mt-20">
          <h2 className="font-display text-4xl">Packages</h2>
          {!Array.isArray(p.packages) || p.packages.length === 0 ? (
            <p className="mt-6 text-mute">Nothing available yet.</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {p.packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </section>

        {/* Optical Equipment & Camera Gear Showcase */}
        <KitbagShowcase photographerId={p.id} photographerName={p.full_name} />

        {/* Verified Client Testimonials */}
        <ClientReviewsSection
          photographerId={p.id}
          title={`Verified Commendations for ${p.full_name.split(' ')[0]}`}
          subtitle={`Direct reviews from private patrons and couples photographed by ${p.full_name}.`}
        />
      </div>
    </div>
  )
}
