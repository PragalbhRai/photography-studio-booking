import type { Booking } from './types'

function formatIcsDate(isoString: string): string {
  const d = new Date(isoString)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function generateGoogleCalendarUrl(booking: Booking): string {
  const title = encodeURIComponent(`Northlight Studio: ${booking.package_name ?? 'Photography Sitting'}`)
  const start = formatIcsDate(booking.start_datetime)
  const end = formatIcsDate(booking.end_datetime)
  const location = encodeURIComponent('Northlight Studio, 14, Ballard Estate, Fort, Mumbai 400001')
  const details = encodeURIComponent(
    `Your photography sitting with Northlight Studio.\n\n` +
      `Photographer: ${booking.photographer_name ?? 'Master Photographer'}\n` +
      `Package: ${booking.package_name ?? 'Signature Session'}\n` +
      `Status: Confirmed\n\n` +
      `Studio Address: 14, Ballard Estate, Fort, Mumbai\n` +
      `Inquiries: +91 22 4000 1200 | studio@northlight.example\n\n` +
      `Please arrive 15 minutes before your scheduled start time.`,
  )

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`
}

export function downloadIcsFile(booking: Booking): void {
  const title = `Northlight Studio: ${booking.package_name ?? 'Photography Sitting'}`
  const start = formatIcsDate(booking.start_datetime)
  const end = formatIcsDate(booking.end_datetime)
  const now = formatIcsDate(new Date().toISOString())
  const location = 'Northlight Studio, 14, Ballard Estate, Fort, Mumbai 400001'
  const description =
    `Your photography sitting with Northlight Studio.\\n` +
    `Photographer: ${booking.photographer_name ?? 'Master Photographer'}\\n` +
    `Package: ${booking.package_name ?? 'Signature Session'}\\n` +
    `Status: Confirmed\\n\\n` +
    `Studio Contact: +91 22 4000 1200 | studio@northlight.example\\n` +
    `Please arrive 15 minutes prior for staging and wardrobe check.`

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Northlight Studio//Client Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:sitting-${booking.id}@northlight.studio`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `northlight-sitting-${booking.id.slice(-6)}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
