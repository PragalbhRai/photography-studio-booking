import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { photographersApi, queryKeys } from '@/lib/endpoints'
import { PhotographerCard } from '@/components/photographers/PhotographerCard'
import { PageState, Skeleton } from '@/components/ui/States'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/photographers')({
  component: PhotographersPage,
})

function PhotographersPage() {
  const query = useQuery({ queryKey: queryKeys.photographers, queryFn: photographersApi.list })

  return (
    <div className="mx-auto max-w-site px-5 py-16 md:px-8 md:py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">The roster</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">Photographers</h1>
      <p className="mt-4 max-w-2xl text-mute">
        A small bench of artists. Each photographer brings a distinct eye; all share the studio’s editorial standard.
      </p>
      <div className="mt-12">
        {query.isLoading ? (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : query.isError ? (
          <PageState
            title="Something went wrong. Please try again."
            body="Photographers could not be loaded."
            action={
              <Button variant="secondary" onClick={() => query.refetch()}>
                Retry
              </Button>
            }
          />
        ) : !Array.isArray(query.data) || !query.data.length ? (
          <PageState title="Nothing available yet." body="The roster will appear here once photographers are added." />
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.map((p) => (
              <PhotographerCard key={p.id} photographer={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
