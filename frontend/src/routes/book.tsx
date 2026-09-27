import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { SITTING_ADDONS } from '@/lib/addons'
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
  const queryClient = useQueryClient()
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

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

  const pkg = selectedPackageQuery.data
  const photographer = selectedPhotographerQuery.data ?? photographersQuery.data?.find((p) => p.id === photographerId)

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const found = SITTING_ADDONS.find((a) => a.id === id)
    return sum + (found?.price ?? 0)
  }, 0)
  const finalPrice = (pkg?.price ?? 0) + addonsTotal

  const bookingMutation = useMutation({
    mutationFn: () =>
      bookingsApi.create({
        photographer_id: photographerId!,
        package_id: packageId!,
        start_datetime: slot!.start_datetime,
        addons: selectedAddons,
        price: finalPrice,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.myBookings })
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
                    className={cn(
                      'relative border py-3 px-2 text-center transition',
                      item.is_golden_hour
                        ? 'border-brass/70 bg-amber-50/60 hover:border-ink hover:bg-amber-100/70'
                        : 'border-line bg-cream hover:border-ink',
                    )}
                  >
                    <span className="block text-sm text-ink">{item.display_time}</span>
                    {item.is_golden_hour ? (
                      <span className="mt-1 inline-block text-[9px] uppercase tracking-wider text-brass font-medium">
                        ✨ Golden Hour
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {step === 4 && pkg && photographer && slot && date ? (
          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-line bg-cream p-8">
              <h2 className="font-display text-3xl">Confirm your sitting</h2>
              <dl className="mt-8 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-mute">Package</dt>
                  <dd className="font-medium">{pkg.name}</dd>
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
                  <dd className="flex items-center gap-1.5">
                    {slot.display_time}
                    {slot.is_golden_hour ? (
                      <span className="text-[9px] uppercase tracking-wider bg-brass/15 text-brass px-1.5 py-0.5 rounded font-medium">
                        ✨ Golden Hour
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-mute">Duration</dt>
                  <dd>{formatDuration(pkg.duration_minutes)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-mute">Base Package</dt>
                  <dd>{formatPrice(pkg.price)}</dd>
                </div>
                {selectedAddons.length > 0 ? (
                  <div className="flex justify-between gap-4 border-b border-line pb-3 text-brass">
                    <dt className="flex items-center gap-1">
                      <span>Enhancements ({selectedAddons.length})</span>
                    </dt>
                    <dd className="font-medium">+{formatPrice(addonsTotal)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4 pt-1">
                  <dt className="text-mute">Total Investment</dt>
                  <dd className="font-display text-2xl font-semibold text-ink">{formatPrice(finalPrice)}</dd>
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
                  className="mt-8 w-full"
                  size="lg"
                  disabled={!confirmed || bookingMutation.isPending}
                  onClick={() => bookingMutation.mutate()}
                >
                  {bookingMutation.isPending ? 'Reserving…' : `Confirm booking · ${formatPrice(finalPrice)}`}
                </Button>
              )}
              <button type="button" className="mt-4 block text-xs uppercase tracking-[0.16em] text-mute" onClick={() => setSlot(null)}>
                Choose another time
              </button>
            </div>

            {/* Right Column: Luxury Add-On Concierge */}
            <div className="border border-line bg-cream p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-brass font-medium">Bespoke Enhancements</p>
                  <h3 className="mt-1 font-display text-2xl">Concierge Add-ons</h3>
                </div>
                <span className="rounded bg-paper px-2.5 py-1 text-xs text-mute border border-line">Optional</span>
              </div>
              <p className="mt-2 text-xs text-mute leading-relaxed">
                Elevate your sitting with specialized equipment, styling artists, or expedited delivery.
              </p>

              <div className="mt-6 space-y-3">
                {SITTING_ADDONS.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id)
                  return (
                    <div
                      key={addon.id}
                      onClick={() => {
                        setSelectedAddons((prev) =>
                          isSelected ? prev.filter((id) => id !== addon.id) : [...prev, addon.id],
                        )
                      }}
                      className={cn(
                        'cursor-pointer border p-3.5 transition select-none',
                        isSelected
                          ? 'border-ink bg-paper shadow-sm'
                          : 'border-line/70 bg-paper/60 hover:border-ink/50',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 rounded border-line cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm text-ink">{addon.name}</p>
                              {addon.badge ? (
                                <span className="text-[9px] uppercase tracking-wider bg-brass/15 text-brass px-1.5 py-0.5 rounded font-medium">
                                  {addon.badge}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-xs text-mute leading-snug">{addon.description}</p>
                          </div>
                        </div>
                        <span className="font-display text-sm font-semibold whitespace-nowrap text-ink">
                          +{formatPrice(addon.price)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
