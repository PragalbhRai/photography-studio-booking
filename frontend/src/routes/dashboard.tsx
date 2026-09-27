import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { bookingsApi, queryKeys } from '@/lib/endpoints'
import { requireRole } from '@/lib/guards'
import { getErrorMessage } from '@/lib/errors'
import {
  bookingDurationMinutes,
  formatDate,
  formatDuration,
  formatPrice,
  formatTime,
  statusLabel,
} from '@/lib/format'
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar'
import { SITTING_ADDONS } from '@/lib/addons'
import { MOODBOARD_PRESETS } from '@/lib/moodboards'
import { ShootPrepGuide } from '@/components/dashboard/ShootPrepGuide'
import { ProofingGallery } from '@/components/proofing/ProofingGallery'
import { LeaveReviewModal } from '@/components/reviews/LeaveReviewModal'
import { LegalAgreementsSection } from '@/components/contracts/LegalAgreementsSection'
import { ProductionCallSheetModal } from '@/components/contracts/ProductionCallSheetModal'
import { useAuth } from '@/lib/auth'
import type { Booking } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { PageState, Skeleton } from '@/components/ui/States'
import { useState } from 'react'

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
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null)
  const [callSheetBooking, setCallSheetBooking] = useState<Booking | null>(null)
  const [callSheetGenericOpen, setCallSheetGenericOpen] = useState(false)
  const query = useQuery({
    queryKey: queryKeys.myBookings,
    queryFn: bookingsApi.mine,
    refetchOnMount: 'always',
    staleTime: 0,
  })
  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.myBookings })
    },
  })

  const { upcoming, past } = splitBookings(Array.isArray(query.data) ? query.data : [])
  const nextUpcoming = upcoming.find((b) => b.status === 'confirmed')

  return (
    <div className="mx-auto max-w-site px-5 py-16 md:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Client</p>
          <h1 className="mt-2 font-display text-5xl">Hello, {user?.full_name ? user.full_name.split(' ')[0] : 'Client'}</h1>
          <p className="mt-3 text-mute">Your sittings with Northlight.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setCallSheetGenericOpen(true)}
            className="flex items-center gap-2"
          >
            <span>🤖</span> Generate AI Call Sheet
          </Button>
          <Link to="/book">
            <Button size="lg">Book a new sitting</Button>
          </Link>
        </div>
      </div>

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
          {nextUpcoming ? <ShootPrepGuide booking={nextUpcoming} /> : null}
          <Section
            title="Upcoming"
            bookings={upcoming}
            onCancel={(id) => cancelMutation.mutate(id)}
            pendingId={cancelMutation.isPending ? cancelMutation.variables : null}
            error={cancelMutation.isError ? getErrorMessage(cancelMutation.error) : null}
            isUpcoming
            onReview={(b) => setReviewingBooking(b)}
            onCallSheet={(b) => setCallSheetBooking(b)}
          />
          <Section
            title="Past"
            bookings={past}
            onReview={(b) => setReviewingBooking(b)}
            onCallSheet={(b) => setCallSheetBooking(b)}
          />
          <ProofingGallery />
          <LegalAgreementsSection userName={user?.full_name} />
        </>
      )}

      {/* Client Review Submission Modal */}
      <LeaveReviewModal
        isOpen={Boolean(reviewingBooking)}
        onClose={() => setReviewingBooking(null)}
        photographerId={reviewingBooking?.photographer_id ?? 'photo-1'}
        photographerName={reviewingBooking?.photographer_name ?? 'Studio Artist'}
        packageName={reviewingBooking?.package_name ?? 'Studio Sitting'}
        packageId={reviewingBooking?.package_id ?? 'pkg-1'}
      />

      {/* AI Production Call Sheet Modal */}
      <ProductionCallSheetModal
        isOpen={Boolean(callSheetBooking) || callSheetGenericOpen}
        onClose={() => {
          setCallSheetBooking(null)
          setCallSheetGenericOpen(false)
        }}
        sittingId={callSheetBooking?.id || 'NL-SIT-2026-081'}
        clientName={user?.full_name || 'Pooja & Karan Malhotra'}
        packageName={callSheetBooking?.package_name || 'Royal Palace Wedding Masterwork'}
        photographerName={callSheetBooking?.photographer_name || 'Aarav Sharma'}
      />
    </div>
  )
}

function Section({
  title,
  bookings,
  onCancel,
  pendingId,
  error,
  isUpcoming,
  onReview,
  onCallSheet,
}: {
  title: string
  bookings: Booking[]
  onCancel?: (id: string) => void
  pendingId?: string | null
  error?: string | null
  isUpcoming?: boolean
  onReview?: (booking: Booking) => void
  onCallSheet?: (booking: Booking) => void
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl">{title}</h2>
      {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
      {!Array.isArray(bookings) || bookings.length === 0 ? (
        isUpcoming ? (
          <div className="mt-6 border border-line bg-cream p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl">No upcoming reservations yet</p>
              <p className="mt-1 text-sm text-mute">Reserve your sitting with one of our master photographers today.</p>
            </div>
            <Link to="/book" className="mt-4 inline-block sm:mt-0">
              <Button size="sm">Choose package & book</Button>
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-mute">No past sittings completed yet.</p>
        )
      ) : (
        <ul className="mt-6 divide-y divide-line border border-line bg-cream">
          {bookings.map((booking) => (
            <li key={booking.id} className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-2xl">{booking.package_name ?? 'Package'}</p>
                  {booking.price ? (
                    <span className="font-display text-lg font-semibold text-ink">· {formatPrice(booking.price)}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-mute">
                  Photographer: <span className="font-medium text-ink">{booking.photographer_name}</span> · {formatDate(booking.start_datetime)} · {formatTime(booking.start_datetime)} ·{' '}
                  {formatDuration(bookingDurationMinutes(booking.start_datetime, booking.end_datetime))}
                </p>

                {/* Selected Add-ons badges if any */}
                {booking.addons && booking.addons.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-mute">Enhancements:</span>
                    {booking.addons.map((addonId) => {
                      const addon = SITTING_ADDONS.find((a) => a.id === addonId)
                      return addon ? (
                        <span key={addonId} className="rounded border border-line bg-paper px-2 py-0.5 text-[10px] text-ink font-medium">
                          ✦ {addon.name}
                        </span>
                      ) : null
                    })}
                  </div>
                ) : null}

                {/* Selected Aesthetic Moodboard if any */}
                {booking.moodboard_id ? (
                  (() => {
                    const mb = MOODBOARD_PRESETS.find((m) => m.id === booking.moodboard_id)
                    return mb ? (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-mute">Aesthetic:</span>
                        <span className="rounded border border-line bg-paper px-2 py-0.5 text-[10px] text-ink font-medium">
                          ✨ {mb.name}
                        </span>
                        <div className="flex items-center -space-x-1">
                          {mb.palette.map((c) => (
                            <span
                              key={c.name}
                              className="inline-block h-2.5 w-2.5 rounded-full border border-ink/20"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null
                  })()
                ) : null}

                <p className="mt-2.5 text-[11px] uppercase tracking-[0.16em] text-brass">{statusLabel(booking.status)}</p>
              </div>

              {/* Action buttons: Calendar sync & Cancel */}
              <div className="flex flex-wrap items-center gap-2">
                {booking.status === 'confirmed' ? (
                  <>
                    <a
                      href={generateGoogleCalendarUrl(booking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded border border-line bg-paper px-3 py-1.5 text-xs uppercase tracking-wider text-ink hover:border-ink hover:bg-cream transition"
                      title="Add to Google Calendar"
                    >
                      <span>📅</span> Google Cal
                    </a>
                    <button
                      type="button"
                      onClick={() => downloadIcsFile(booking)}
                      className="inline-flex items-center gap-1.5 rounded border border-line bg-paper px-3 py-1.5 text-xs uppercase tracking-wider text-ink hover:border-ink hover:bg-cream transition"
                      title="Download Apple / Outlook .ics calendar file"
                    >
                      <span>🍏</span> Apple / .ics
                    </button>
                    <button
                      type="button"
                      onClick={() => onCallSheet?.(booking)}
                      className="inline-flex items-center gap-1.5 rounded border border-line bg-paper px-3 py-1.5 text-xs uppercase tracking-wider text-ink hover:border-ink hover:bg-cream transition"
                      title="View or Print AI Production Call Sheet"
                    >
                      <span>🎬</span> Call Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => onReview?.(booking)}
                      className="inline-flex items-center gap-1.5 rounded border border-brass/60 bg-paper px-3 py-1.5 text-xs uppercase tracking-wider text-brass hover:border-brass hover:bg-brass/10 transition"
                      title="Rate and review your photographer"
                    >
                      <span>★</span> Review Sitting
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onCallSheet?.(booking)}
                      className="inline-flex items-center gap-1.5 rounded border border-line bg-paper px-3 py-1.5 text-xs uppercase tracking-wider text-ink hover:border-ink hover:bg-cream transition"
                      title="View or Print AI Production Call Sheet"
                    >
                      <span>🎬</span> Call Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => onReview?.(booking)}
                      className="inline-flex items-center gap-1.5 rounded border border-brass/60 bg-paper px-3 py-1.5 text-xs uppercase tracking-wider text-brass hover:border-brass hover:bg-brass/10 transition"
                      title="Rate and review your photographer"
                    >
                      <span>★</span> Review Sitting
                    </button>
                  </>
                )}

                {onCancel && booking.status === 'confirmed' ? (
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={pendingId === booking.id}
                    onClick={() => {
                      if (window.confirm('Cancel this booking?')) onCancel(booking.id)
                    }}
                  >
                    Cancel sitting
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
