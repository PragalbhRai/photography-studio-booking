import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  availabilityApi,
  bookingsApi,
  packagesApi,
  photographersApi,
  queryKeys,
} from '@/lib/endpoints'
import { getErrorMessage, isConflict, isUnauthorized } from '@/lib/errors'
import { formatDate, formatDuration, formatPrice } from '@/lib/format'
import { portraitForId } from '@/lib/images'
import type { AvailabilitySlot } from '@/lib/types'
import { useAuth } from '@/lib/auth'
import { Calendar } from '@/components/booking/Calendar'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { PageState, Skeleton } from '@/components/ui/States'
import { cn } from '@/lib/cn'

type BookSearch = {
  packageId?: string
  photographerId?: string
}

export const Route = createFileRoute('/book')({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    packageId: typeof search.packageId === 'string' ? search.packageId : undefined,
    photographerId: typeof search.photographerId === 'string' ? search.photographerId : undefined,
  }),
  component: BookPage,
})

const STEPS = ['Package', 'Photographer', 'Date', 'Time', 'Confirm'] as const

function BookPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/book' })
  const { user } = useAuth()
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [conflict, setConflict] = useState(false)

  const packageId = search.packageId
  const photographerId = search.photographerId

  const packagesQuery = useQuery({ queryKey: queryKeys.packages, queryFn: packagesApi.list })
  const photographersQuery = useQuery({
    queryKey: queryKeys.photographers,
    queryFn: photographersApi.list,
  })
  const selectedPackageQuery = useQuery({
    queryKey: queryKeys.package(packageId ?? ''),
    queryFn: () => packagesApi.get(packageId!),
    enabled: Boolean(packageId),
  })
  const selectedPhotographerQuery = useQuery({
    queryKey: queryKeys.photographer(photographerId ?? ''),
    queryFn: () => photographersApi.get(photographerId!),
    enabled: Boolean(photographerId),
  })

  const availabilityParams = {
    photographer_id: photographerId ?? '',
    package_id: packageId ?? '',
    date: date ?? '',
  }
  const availabilityQuery = useQuery({
    queryKey: queryKeys.availability(availabilityParams),
    queryFn: () => availabilityApi.get(availabilityParams),
    enabled: Boolean(photographerId && packageId && date),
  })

  const step = useMemo(() => {
    if (!packageId) return 0
    if (!photographerId) return 1
    if (!date) return 2
    if (!slot) return 3
    return 4
  }, [packageId, photographerId, date, slot])

  const bookingMutation = useMutation({
    mutationFn: () =>
      bookingsApi.create({
        photographer_id: photographerId!,
        package_id: packageId!,
        start_datetime: slot!.start_datetime,
      }),
    onSuccess: () => {
      void navigate({ to: '/dashboard' })
    },
    onError: (error) => {
      if (isConflict(error)) {
        setConflict(true)
        setSlot(null)
        void availabilityQuery.refetch()
        return
      }
      if (isUnauthorized(error)) {
        void navigate({ to: '/login', search: { redirect: '/book' } })
      }
    },
  })

  const setSearch = (next: BookSearch) => {
    setSlot(null)
    setConfirmed(false)
    setConflict(false)
    void navigate({ search: next })
  }

  const pkg = selectedPackageQuery.data
  const photographer = selectedPhotographerQuery.data ?? photographersQuery.data?.find((p) => p.id === photographerId)

  return (
    <div className="mx-auto max-w-site px-5 py-12 md:px-8 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Reservations</p>
      <h1 className="mt-3 font-display text-5xl">Book a session</h1>
      <ol className="mt-8 flex flex-wrap gap-2" aria-label="Booking steps">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={cn(
              'border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]',
              i === step ? 'border-ink bg-ink text-cream' : 'border-line text-mute',
              i < step && 'border-ink/40 text-ink',
            )}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {conflict ? (
        <p className="mt-6 border border-line bg-cream px-4 py-3 text-sm" role="status">
          That slot was just booked. Please choose another time.
        </p>
      ) : null}

      <div className="mt-10">
        {step === 0 ? (
          <section>
            <h2 className="font-display text-3xl">Choose a package</h2>
            {packagesQuery.isLoading ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : packagesQuery.isError ? (
              <PageState title="Something went wrong. Please try again." body="Packages could not be loaded." />
            ) : !Array.isArray(packagesQuery.data) || !packagesQuery.data.length ? (
              <PageState title="Nothing available yet." body="There are no bookable packages." />
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {packagesQuery.data.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSearch({ packageId: item.id, photographerId })}
                    className="flex gap-4 border border-line bg-cream p-3 text-left transition hover:-translate-y-0.5"
                  >
                    <div className="h-28 w-24 shrink-0 overflow-hidden">
                      <Photo src={item.image_url} alt="" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-brass">{item.category}</p>
                      <p className="font-display text-2xl">{item.name}</p>
                      <p className="mt-1 text-sm text-mute">
                        {formatDuration(item.duration_minutes)} · {formatPrice(item.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {step === 1 ? (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">Choose a photographer</h2>
              <button type="button" className="text-xs uppercase tracking-[0.16em] text-mute" onClick={() => setSearch({})}>
                Change package
              </button>
            </div>
            {photographersQuery.isLoading ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : photographersQuery.isError ? (
              <PageState title="Something went wrong. Please try again." body="Photographers could not be loaded." />
            ) : !Array.isArray(photographersQuery.data) || !photographersQuery.data.length ? (
              <PageState title="Nothing available yet." body="No photographers are listed." />
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photographersQuery.data.map((item) => (
                  <div
                    key={item.id}
                    className="border border-line bg-cream transition hover:-translate-y-0.5"
                  >
                    <button
                      type="button"
                      onClick={() => setSearch({ packageId, photographerId: item.id })}
                      className="w-full text-left"
                    >
                      <div className="aspect-[4/5] overflow-hidden">
                        <Photo src={portraitForId(item.id)} alt="" />
                      </div>
                      <div className="p-4">
                        <p className="font-display text-2xl">{item.full_name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mute">
                          {item.specialties.slice(0, 3).join(' · ') || 'Photographer'}
                        </p>
                      </div>
                    </button>
                    <div className="border-t border-line px-4 pb-4">
                      <Link
                        to="/photographers/$photographerId"
                        params={{ photographerId: item.id }}
                        className="text-xs uppercase tracking-[0.16em] text-mute underline decoration-line underline-offset-4 hover:text-ink hover:decoration-ink"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {step === 2 ? (
          <section className="grid gap-8 md:grid-cols-[1fr_280px]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-3xl">Choose a date</h2>
                <button
                  type="button"
                  className="text-xs uppercase tracking-[0.16em] text-mute"
                  onClick={() => setSearch({ packageId })}
                >
                  Change photographer
                </button>
              </div>
              <Calendar value={date} onChange={(next) => { setDate(next); setSlot(null) }} minDate={new Date()} />
            </div>
            <aside className="h-fit border border-line bg-cream p-5 text-sm">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mute">Selected</p>
              <p className="mt-3 font-display text-2xl">{pkg?.name}</p>
              <p className="text-mute">{photographer?.full_name}</p>
            </aside>
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-3xl">Available times</h2>
              <button type="button" className="text-xs uppercase tracking-[0.16em] text-mute" onClick={() => setDate(null)}>
                Change date
              </button>
            </div>
            <p className="text-sm text-mute">{date ? formatDate(`${date}T00:00:00+05:30`) : null} · 15-minute starts · Asia/Kolkata</p>
            {availabilityQuery.isLoading ? (
              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : availabilityQuery.isError ? (
              <PageState
                title="Something went wrong. Please try again."
                body="Availability could not be loaded."
                action={
                  <Button variant="secondary" onClick={() => availabilityQuery.refetch()}>
                    Retry
                  </Button>
                }
              />
            ) : !Array.isArray(availabilityQuery.data?.available_slots) || !availabilityQuery.data.available_slots.length ? (
              <PageState title="Nothing available yet." body="No times are open on this date. Please choose another day." />
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {availabilityQuery.data.available_slots.map((item) => (
                  <button
                    key={item.start_datetime}
                    type="button"
                    onClick={() => setSlot(item)}
                    className="border border-line bg-cream py-3 text-sm transition hover:border-ink"
                  >
                    {item.display_time}
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {step === 4 && pkg && photographer && slot && date ? (
          <section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div className="border border-line bg-cream p-8">
              <h2 className="font-display text-3xl">Confirm your sitting</h2>
              <dl className="mt-8 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-mute">Package</dt>
                  <dd>{pkg.name}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-mute">Photographer</dt>
                  <dd>{photographer.full_name}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-mute">Date</dt>
                  <dd>{formatDate(slot.start_datetime)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-mute">Time</dt>
                  <dd>{slot.display_time}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-mute">Duration</dt>
                  <dd>{formatDuration(pkg.duration_minutes)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-mute">Price</dt>
                  <dd className="font-display text-2xl">{formatPrice(pkg.price)}</dd>
                </div>
              </dl>
              <label className="mt-8 flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1"
                />
                <span>I confirm this reservation and understand cancellations require at least two hours’ notice.</span>
              </label>
              {bookingMutation.isError && !isConflict(bookingMutation.error) ? (
                <p className="mt-4 text-sm text-red-800">{getErrorMessage(bookingMutation.error)}</p>
              ) : null}
              {!user ? (
                <p className="mt-6 text-sm">
                  Please sign in to continue.{' '}
                  <Link to="/login" search={{ redirect: '/book' }} className="underline">
                    Login
                  </Link>{' '}
                  or{' '}
                  <Link to="/register" search={{ redirect: '/book' }} className="underline">
                    register
                  </Link>
                  .
                </p>
              ) : user.role !== 'customer' ? (
                <p className="mt-6 text-sm text-red-800">Bookings can only be created with a customer account.</p>
              ) : (
                <Button
                  className="mt-8"
                  size="lg"
                  disabled={!confirmed || bookingMutation.isPending}
                  onClick={() => bookingMutation.mutate()}
                >
                  {bookingMutation.isPending ? 'Reserving…' : 'Confirm booking'}
                </Button>
              )}
              <button type="button" className="mt-4 block text-xs uppercase tracking-[0.16em] text-mute" onClick={() => setSlot(null)}>
                Choose another time
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
