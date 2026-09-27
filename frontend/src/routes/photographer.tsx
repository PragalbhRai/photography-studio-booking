import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { blockedPeriodsApi, bookingsApi, queryKeys, workingHoursApi } from '@/lib/endpoints'
import { requireRole } from '@/lib/guards'
import { getErrorMessage } from '@/lib/errors'
import {
  bookingDurationMinutes,
  dayName,
  formatDate,
  formatDateTime,
  formatDuration,
  formatTime,
  statusLabel,
} from '@/lib/format'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { PageState, Skeleton } from '@/components/ui/States'

export const Route = createFileRoute('/photographer')({
  beforeLoad: ({ context, location }) => requireRole({ context, location, roles: ['photographer'] }),
  component: PhotographerDashboard,
})

type Tab = 'overview' | 'hours' | 'blocked' | 'bookings'

export function PhotographerDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className="mx-auto max-w-site px-5 py-16 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Photographer</p>
      <h1 className="mt-2 font-display text-5xl">{user?.full_name}</h1>
      <p className="mt-3 text-mute">Manage hours, blocked time, and your studio schedule.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ['overview', 'Overview'],
            ['hours', 'Working hours'],
            ['blocked', 'Blocked periods'],
            ['bookings', 'Bookings'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`border px-4 py-2 text-xs uppercase tracking-[0.16em] ${tab === id ? 'border-ink bg-ink text-cream' : 'border-line'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-10">
        {tab === 'overview' ? <Overview /> : null}
        {tab === 'hours' ? <WorkingHoursPanel /> : null}
        {tab === 'blocked' ? <BlockedPanel /> : null}
        {tab === 'bookings' ? <PhotographerBookingsPanel /> : null}
      </div>
    </div>
  )
}

function Overview() {
  const hours = useQuery({ queryKey: queryKeys.workingHours, queryFn: workingHoursApi.list })
  const blocked = useQuery({ queryKey: queryKeys.blockedPeriods, queryFn: blockedPeriodsApi.list })
  const bookings = useQuery({
    queryKey: queryKeys.photographerBookings,
    queryFn: bookingsApi.photographer,
  })
  if (hours.isLoading || blocked.isLoading || bookings.isLoading) return <Skeleton className="h-40" />
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Stat
        label="Confirmed bookings"
        value={String(bookings.data?.filter((b) => b.status === 'confirmed').length ?? 0)}
      />
      <Stat label="Working days" value={String(hours.data?.length ?? 0)} />
      <Stat label="Blocked periods" value={String(blocked.data?.length ?? 0)} />
      <Stat label="Timezone" value="Asia/Kolkata" />
    </div>
  )
}

function PhotographerBookingsPanel() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: queryKeys.photographerBookings,
    queryFn: bookingsApi.photographer,
  })
  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.photographerBookings })
    },
  })

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    )
  }

  if (query.isError) {
    return (
      <PageState
        title="Something went wrong. Please try again."
        body="Your assigned bookings could not be loaded."
        action={
          <Button variant="secondary" onClick={() => query.refetch()}>
            Retry
          </Button>
        }
      />
    )
  }

  const bookings = query.data ?? []

  if (bookings.length === 0) {
    return (
      <PageState
        title="No bookings assigned yet"
        body="When clients book sessions with you, they will appear here with scheduled date, duration, package, and client name."
      />
    )
  }

  return (
    <div>
      <h2 className="font-display text-3xl">Assigned client sittings</h2>
      <ul className="mt-6 divide-y divide-line border border-line bg-cream">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-display text-2xl">{booking.package_name ?? 'Photography Session'}</p>
              <p className="mt-1 text-sm text-mute">
                Client: <span className="font-medium text-ink">{booking.customer_name ?? 'Client'}</span> ·{' '}
                {formatDate(booking.start_datetime)} · {formatTime(booking.start_datetime)} ·{' '}
                {formatDuration(bookingDurationMinutes(booking.start_datetime, booking.end_datetime))}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-brass">
                {statusLabel(booking.status)}
              </p>
            </div>
            {booking.status === 'confirmed' ? (
              <Button
                variant="danger"
                size="sm"
                disabled={cancelMutation.isPending && cancelMutation.variables === booking.id}
                onClick={() => {
                  if (window.confirm('Cancel this client sitting?')) {
                    cancelMutation.mutate(booking.id)
                  }
                }}
              >
                Cancel sitting
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-cream p-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-mute">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </div>
  )
}

function toApiTime(value: string) {
  return value.length === 5 ? `${value}:00` : value
}

function WorkingHoursPanel() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: queryKeys.workingHours, queryFn: workingHoursApi.list })
  const [dayOfWeek, setDayOfWeek] = useState<number>(0)
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('18:00')
  const [error, setError] = useState<string | null>(null)

  const save = useMutation({
    mutationFn: (values: { day_of_week: number; start_time: string; end_time: string }) =>
      workingHoursApi.upsert({
        day_of_week: values.day_of_week,
        start_time: toApiTime(values.start_time),
        end_time: toApiTime(values.end_time),
      }),
    onSuccess: async () => {
      setError(null)
      await queryClient.invalidateQueries({ queryKey: queryKeys.workingHours })
      await query.refetch()
    },
    onError: (err) => {
      setError(getErrorMessage(err, 'Failed to save working hours'))
    },
  })

  const remove = useMutation({
    mutationFn: (day: number) => workingHoursApi.remove(day),
    onSuccess: async () => {
      setError(null)
      await queryClient.invalidateQueries({ queryKey: queryKeys.workingHours })
      await query.refetch()
    },
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate({ day_of_week: dayOfWeek, start_time: startTime, end_time: endTime })
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form className="space-y-4 border border-line bg-cream p-6" onSubmit={handleSave}>
        <h2 className="font-display text-3xl">Set a day</h2>
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.16em] text-mute">Day</span>
          <select
            className="w-full border border-line bg-cream px-3 py-2.5 text-sm"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <option key={i} value={i}>
                {dayName(i)}
              </option>
            ))}
          </select>
        </label>
        <TextField
          label="Start"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <TextField
          label="End"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        {error ? <p className="text-sm text-red-800">{error}</p> : null}
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? 'Saving…' : 'Save hours'}
        </Button>
      </form>
      <div>
        <h2 className="font-display text-3xl">This week</h2>
        {query.isLoading ? (
          <Skeleton className="mt-4 h-48" />
        ) : query.isError ? (
          <p className="mt-4 text-sm text-red-800">Something went wrong. Please try again.</p>
        ) : !query.data?.length ? (
          <p className="mt-4 text-sm text-mute">Nothing available yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border border-line bg-cream">
            {query.data.map((row) => (
              <li key={row.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>
                  {dayName(row.day_of_week)} · {row.start_time.slice(0, 5)}–{row.end_time.slice(0, 5)}
                </span>
                <Button size="sm" variant="ghost" onClick={() => remove.mutate(row.day_of_week)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function BlockedPanel() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: queryKeys.blockedPeriods, queryFn: blockedPeriodsApi.list })
  const [startDatetime, setStartDatetime] = useState('')
  const [endDatetime, setEndDatetime] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const create = useMutation({
    mutationFn: (values: { start_datetime: string; end_datetime: string; reason: string }) =>
      blockedPeriodsApi.create({
        start_datetime: new Date(values.start_datetime).toISOString(),
        end_datetime: new Date(values.end_datetime).toISOString(),
        reason: values.reason || undefined,
      }),
    onSuccess: async () => {
      setError(null)
      setStartDatetime('')
      setEndDatetime('')
      setReason('')
      await queryClient.invalidateQueries({ queryKey: queryKeys.blockedPeriods })
      await query.refetch()
    },
    onError: (err) => {
      setError(getErrorMessage(err, 'Failed to add blocked period'))
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => blockedPeriodsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blockedPeriods })
      await query.refetch()
    },
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDatetime || !endDatetime) {
      setError('Please select both start and end times')
      return
    }
    create.mutate({ start_datetime: startDatetime, end_datetime: endDatetime, reason })
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form className="space-y-4 border border-line bg-cream p-6" onSubmit={handleCreate}>
        <h2 className="font-display text-3xl">Block time</h2>
        <TextField
          label="Starts"
          type="datetime-local"
          value={startDatetime}
          onChange={(e) => setStartDatetime(e.target.value)}
        />
        <TextField
          label="Ends"
          type="datetime-local"
          value={endDatetime}
          onChange={(e) => setEndDatetime(e.target.value)}
        />
        <TextField
          label="Reason"
          value={reason}
          placeholder="e.g. Travel / Personal sitting"
          onChange={(e) => setReason(e.target.value)}
        />
        {error ? <p className="text-sm text-red-800">{error}</p> : null}
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Adding…' : 'Add blocked period'}
        </Button>
      </form>
      <div>
        <h2 className="font-display text-3xl">Upcoming blocks</h2>
        {query.isLoading ? (
          <Skeleton className="mt-4 h-48" />
        ) : query.isError ? (
          <p className="mt-4 text-sm text-red-800">Something went wrong. Please try again.</p>
        ) : !query.data?.length ? (
          <p className="mt-4 text-sm text-mute">No blocked periods added yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border border-line bg-cream">
            {query.data.map((row) => (
              <li key={row.id} className="px-4 py-3 text-sm">
                <p className="font-medium text-ink">
                  {formatDateTime(row.start_datetime)} → {formatDateTime(row.end_datetime)}
                </p>
                <p className="text-mute">{row.reason || 'Unavailable'}</p>
                <Button size="sm" variant="ghost" className="mt-2" onClick={() => remove.mutate(row.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
