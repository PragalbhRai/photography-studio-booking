export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return ''
  return `₹${num.toLocaleString('en-IN')}`
}

export function formatDuration(minutes: number): string {
  if (!minutes && minutes !== 0) return ''
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  if (remaining === 0) return `${hours} hr`
  return `${hours} hr ${remaining} min`
}

export function bookingDurationMinutes(start: string | Date, end: string | Date): number {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  return Math.max(0, Math.round((e - s) / (1000 * 60)))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return `${formatDate(d)}, ${formatTime(d)}`
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function dayName(dayOfWeek: number): string {
  return DAYS[dayOfWeek] ?? ''
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'Confirmed'
    case 'cancelled_by_customer':
      return 'Cancelled by Client'
    case 'cancelled_by_photographer':
      return 'Cancelled by Photographer'
    case 'cancelled_by_admin':
      return 'Cancelled by Studio'
    case 'completed':
      return 'Completed'
    default:
      return status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : ''
  }
}
