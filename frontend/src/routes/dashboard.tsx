import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { bookingsApi, queryKeys } from '@/lib/endpoints'
import { requireRole } from '@/lib/guards'
import { getErrorMessage } from '@/lib/errors'
import {
  bookingDurationMinutes,
  formatDate,
  formatDuration,
  formatTime,
  statusLabel,
} from '@/lib/format'
import { useAuth } from '@/lib/auth'
import type { Booking } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { PageState, Skeleton } from '@/components/ui/States'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => requireRole({ context, location, roles: ['customer'] }),
  component: CustomerDashboard,
})

function splitBookings(bookings: Booking[]) {
  const now = Date.now()
  const upcoming = bookings.filter((b) => new Date(b.start_datetime).getTime() >= now)
  const past = bookings.filter((b) => new Date(b.start_datetime).getTime() < now)
  upcoming.sort((a, b) => +new Date(a.start_datetime) - +new Date(b.start_datetime))
  past.sort((a, b) => +new Date(b.start_datetime) - +new Date(a.start_datetime))
  return { upcoming, past }
}

function CustomerDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: queryKeys.myBookings, queryFn: bookingsApi.mine })
  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.myBookings })
    },
  })

  const { upcoming, past } = splitBookings(Array.isArray(query.data) ? query.data : [])

  return (
    <div className="mx-auto max-w-site px-5 py-16 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Client</p>
      <h1 className="mt-2 font-display text-5xl">Hello, {user?.full_name ? user.full_name.split(' ')[0] : 'Client'}</h1>
      <p className="mt-3 text-mute">Your sittings with Northlight.</p>

      {query.isLoading ? (
        <div className="mt-10 space-y-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : query.isError ? (
        <div className="mt-10">
          <PageState
            title="Something went wrong. Please try again."
            body="Your bookings could not be loaded."
            action={
              <Button variant="secondary" onClick={() => query.refetch()}>
                Retry
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <Section title="Upcoming" bookings={upcoming} onCancel={(id) => cancelMutation.mutate(id)} pendingId={cancelMutation.isPending ? cancelMutation.variables : null} error={cancelMutation.isError ? getErrorMessage(cancelMutation.error) : null} />
          <Section title="Past" bookings={past} />
        </>
      )}
    </div>
  )
}

function Section({
  title,
  bookings,
  onCancel,
  pendingId,
  error,
}: {
  title: string
  bookings: Booking[]
  onCancel?: (id: string) => void
  pendingId?: string | null
  error?: string | null
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl">{title}</h2>
      {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
      {!Array.isArray(bookings) || bookings.length === 0 ? (
        <p className="mt-4 text-sm text-mute">Nothing available yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border border-line bg-cream">
          {bookings.map((booking) => (
            <li key={booking.id} className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-display text-2xl">{booking.package_name ?? 'Package'}</p>
                <p className="mt-1 text-sm text-mute">
                  {booking.photographer_name} · {formatDate(booking.start_datetime)} · {formatTime(booking.start_datetime)} ·{' '}
                  {formatDuration(bookingDurationMinutes(booking.start_datetime, booking.end_datetime))}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-brass">{statusLabel(booking.status)}</p>
              </div>
              {onCancel && booking.status === 'confirmed' ? (
                <Button
                  variant="danger"
                  size="sm"
                  disabled={pendingId === booking.id}
                  onClick={() => {
                    if (window.confirm('Cancel this booking?')) onCancel(booking.id)
                  }}
                >
                  Cancel booking
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
