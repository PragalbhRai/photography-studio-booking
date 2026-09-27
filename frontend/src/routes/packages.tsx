import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { packagesApi, queryKeys } from '@/lib/endpoints'
import { PackageCard } from '@/components/packages/PackageCard'
import { InvestmentCalculator } from '@/components/packages/InvestmentCalculator'
import { PageState, Skeleton } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/packages')({
  component: PackagesPage,
})

function PackagesPage() {
  const query = useQuery({ queryKey: queryKeys.packages, queryFn: packagesApi.list })

  return (
    <div className="mx-auto max-w-site px-5 py-16 md:px-8 md:py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Offerings</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">Photography packages</h1>
      <p className="mt-4 max-w-2xl text-mute">
        Each sitting is timed, priced, and photographed with intention. Select a package to begin booking.
      </p>

      <div className="mt-12">
        {query.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[520px]" />
            ))}
          </div>
        ) : query.isError ? (
          <PageState
            title="Something went wrong. Please try again."
            body="We could not load packages from the studio archive."
            action={
              <Button variant="secondary" onClick={() => query.refetch()}>
                Retry
              </Button>
            }
          />
        ) : !Array.isArray(query.data) || !query.data.length ? (
          <PageState title="Nothing available yet." body="Packages will appear here once they are published." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>

      {/* Interactive Bespoke Sitting Investment Calculator */}
      <InvestmentCalculator />
    </div>
  )
}
