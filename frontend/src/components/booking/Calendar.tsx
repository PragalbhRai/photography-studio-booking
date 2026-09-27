import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  value: string | null
  onChange: (isoDate: string) => void
  minDate?: Date
}

export function Calendar({ value, onChange, minDate }: Props) {
  const initial = value ? new Date(`${value}T00:00:00`) : new Date()
  const [cursor, setCursor] = useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1))

  const year = cursor.getFullYear()
  const monthIndex = cursor.getMonth()
  const first = new Date(year, monthIndex, 1)
  const startPad = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells: Array<Date | null> = []
  for (let i = 0; i < startPad; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, monthIndex, d))
  while (cells.length % 7 !== 0) cells.push(null)

  const min = useMemo(() => {
    if (!minDate) return null
    return new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
  }, [minDate])

  const label = cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="border border-line bg-cream p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="px-2 py-1 text-sm text-mute hover:text-ink"
          onClick={() => setCursor(new Date(year, monthIndex - 1, 1))}
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="font-display text-2xl">{label}</p>
        <button
          type="button"
          className="px-2 py-1 text-sm text-mute hover:text-ink"
          onClick={() => setCursor(new Date(year, monthIndex + 1, 1))}
          aria-label="Next month"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.16em] text-mute">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />
          const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
          const isSelected = value === iso
          const disabled = min ? date < min : false
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              className={cn(
                'aspect-square rounded-sm text-sm transition',
                disabled && 'cursor-not-allowed text-line',
                !disabled && !isSelected && 'hover:bg-ink/5',
                isSelected && 'bg-ink text-cream',
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
