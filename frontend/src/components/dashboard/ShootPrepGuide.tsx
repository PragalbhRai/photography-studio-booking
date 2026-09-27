import { useState, useEffect } from 'react'
import type { Booking } from '@/lib/types'
import { formatDate, formatTime } from '@/lib/format'
import { MOODBOARD_PRESETS } from '@/lib/moodboards'

interface Props {
  booking: Booking
}

export function ShootPrepGuide({ booking }: Props) {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'timeline' | 'location'>('wardrobe')
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isToday: boolean
    isPast: boolean
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false, isPast: false })

  useEffect(() => {
    function calcTime() {
      const target = new Date(booking.start_datetime).getTime()
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        // If within 24 hours of start time, consider it today
        const isRecent = Math.abs(diff) < 24 * 60 * 60 * 1000
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: isRecent, isPast: !isRecent })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isToday: days === 0 && hours < 12,
        isPast: false,
      })
    }

    calcTime()
    const interval = setInterval(calcTime, 1000)
    return () => clearInterval(interval)
  }, [booking.start_datetime])

  const moodboard = booking.moodboard_id
    ? MOODBOARD_PRESETS.find((m) => m.id === booking.moodboard_id)
    : null

  if (timeLeft.isPast) return null

  return (
    <div className="mt-8 overflow-hidden rounded border border-brass/40 bg-paper shadow-sm">
      {/* Header & Live Countdown */}
      <div className="bg-ink px-6 py-6 text-cream sm:flex sm:items-center sm:justify-between sm:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.24em] text-brass">
              Sitting Confirmed · Live Studio Countdown
            </p>
          </div>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl text-cream">
            {booking.package_name ?? 'Studio Session'} with {booking.photographer_name ?? 'Principal Artist'}
          </h3>
          <p className="mt-1 text-xs text-cream/70">
            {formatDate(booking.start_datetime)} at {formatTime(booking.start_datetime)} · Studio Suite 4B, Ballard Estate
          </p>
        </div>

        {/* Countdown Digits */}
        <div className="mt-5 sm:mt-0 flex items-center gap-2">
          {timeLeft.isToday ? (
            <div className="rounded border border-brass bg-brass/20 px-4 py-2 text-center">
              <span className="font-display text-xl text-cream font-bold">✨ TODAY</span>
              <p className="text-[9px] uppercase tracking-wider text-brass">Call Time Approaching</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="min-w-[48px] rounded border border-cream/15 bg-cream/5 px-2 py-2 text-center backdrop-blur-sm">
                <span className="font-display text-2xl font-bold text-cream">{timeLeft.days}</span>
                <p className="text-[9px] uppercase tracking-wider text-cream/60">Days</p>
              </div>
              <span className="font-display text-lg text-brass">:</span>
              <div className="min-w-[48px] rounded border border-cream/15 bg-cream/5 px-2 py-2 text-center backdrop-blur-sm">
                <span className="font-display text-2xl font-bold text-cream">{timeLeft.hours}</span>
                <p className="text-[9px] uppercase tracking-wider text-cream/60">Hrs</p>
              </div>
              <span className="font-display text-lg text-brass">:</span>
              <div className="min-w-[48px] rounded border border-cream/15 bg-cream/5 px-2 py-2 text-center backdrop-blur-sm">
                <span className="font-display text-2xl font-bold text-cream">{timeLeft.minutes}</span>
                <p className="text-[9px] uppercase tracking-wider text-cream/60">Min</p>
              </div>
              <span className="font-display text-lg text-brass">:</span>
              <div className="min-w-[48px] rounded border border-cream/15 bg-cream/5 px-2 py-2 text-center backdrop-blur-sm">
                <span className="font-display text-2xl font-bold text-cream">{timeLeft.seconds}</span>
                <p className="text-[9px] uppercase tracking-wider text-cream/60">Sec</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Moodboard Reference if chosen */}
      {moodboard ? (
        <div className="border-b border-line bg-cream px-6 py-3 sm:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-brass font-semibold">
              Chosen Aesthetic:
            </span>
            <span className="font-display text-sm font-medium text-ink">{moodboard.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-mute">Palette:</span>
            {moodboard.palette.map((c) => (
              <span
                key={c.name}
                className="h-3.5 w-3.5 rounded-full border border-ink/20"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Tab Navigation */}
      <div className="flex border-b border-line bg-cream/60 px-6 sm:px-8">
        <button
          type="button"
          onClick={() => setActiveTab('wardrobe')}
          className={`border-b-2 py-3.5 px-4 text-xs font-medium uppercase tracking-wider transition ${
            activeTab === 'wardrobe'
              ? 'border-ink text-ink font-semibold'
              : 'border-transparent text-mute hover:text-ink'
          }`}
        >
          👗 Wardrobe & Styling Tips
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`border-b-2 py-3.5 px-4 text-xs font-medium uppercase tracking-wider transition ${
            activeTab === 'timeline'
              ? 'border-ink text-ink font-semibold'
              : 'border-transparent text-mute hover:text-ink'
          }`}
        >
          ⏱️ Call Sheet & Schedule
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('location')}
          className={`border-b-2 py-3.5 px-4 text-xs font-medium uppercase tracking-wider transition ${
            activeTab === 'location'
              ? 'border-ink text-ink font-semibold'
              : 'border-transparent text-mute hover:text-ink'
          }`}
        >
          📍 Studio Access & Directions
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8">
        {activeTab === 'wardrobe' && (
          <div className="space-y-4">
            <h4 className="font-display text-xl text-ink">Master Wardrobe Recommendations</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-line bg-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brass">
                  ✓ What Works Magically
                </p>
                <ul className="mt-2 text-xs text-mute space-y-1.5 list-disc pl-4">
                  <li>Rich tactile textures: velvet, raw silk, heavy knits, linen, structured wool.</li>
                  <li>Deep jewel tones, muted pastels, or clean solid neutrals.</li>
                  <li>Bring 2 to 3 outfit variations pressed on sturdy hangers.</li>
                  <li>Fitted undergarments matching skin tones to eliminate fabric bunching.</li>
                </ul>
              </div>

              <div className="rounded border border-line bg-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">
                  ✗ What to Avoid on Camera
                </p>
                <ul className="mt-2 text-xs text-mute space-y-1.5 list-disc pl-4">
                  <li>Tight micro-stripes or houndstooth (causes optical moiré distortion).</li>
                  <li>Prominent commercial logos, bold slogans, or graphic apparel.</li>
                  <li>Translucent thin fabrics unless layered deliberately for backlighting.</li>
                  <li>Wrinkled garments; please steam items the evening prior.</li>
                </ul>
              </div>
            </div>
            {moodboard ? (
              <div className="rounded border border-brass/40 bg-brass/5 p-4 text-xs text-ink">
                <strong className="text-brass font-semibold uppercase tracking-wider">
                  Specific to your chosen {moodboard.name} aesthetic:
                </strong>
                <p className="mt-1 text-mute">{moodboard.wardrobeAdvice}</p>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h4 className="font-display text-xl text-ink">Shoot Day Production Timeline</h4>
            <p className="text-xs text-mute">
              Our sessions follow a relaxed, unhurried cadence designed to bring out natural poise.
            </p>
            <div className="relative border-l-2 border-brass/60 pl-5 space-y-5 mt-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brass">T - 45 Minutes</span>
                <p className="font-display text-base font-semibold text-ink">Studio Welcome & Garment Steaming</p>
                <p className="text-xs text-mute">
                  Arrive at our Ballard Estate lounge. Enjoy fresh espresso or chilled hydration while wardrobe items are unbagged and steamed.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brass">T - 20 Minutes</span>
                <p className="font-display text-base font-semibold text-ink">Lighting Calibration & Test Frames</p>
                <p className="text-xs text-mute">
                  Your lead artist meters key strobes and checks highlight roll-off against skin undertones on calibrated studio displays.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brass">T - 0 (Call Time)</span>
                <p className="font-display text-base font-semibold text-ink">Main Sitting Commences (Look 1)</p>
                <p className="text-xs text-mute">
                  Guided posing and natural expression coaching with continuous live tethered review.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brass">T + 60 Minutes</span>
                <p className="font-display text-base font-semibold text-ink">Look 2 Transition & Hero Frame Wrap</p>
                <p className="text-xs text-mute">
                  Wardrobe switch, modifier adjustment, and final hero capture selection.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-4">
            <h4 className="font-display text-xl text-ink">Studio Location & Valet Parking</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-line bg-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brass">
                  Physical Address
                </p>
                <p className="mt-1 font-display text-lg text-ink">Northlight Studio — Mumbai</p>
                <p className="mt-1 text-xs text-mute leading-relaxed">
                  14, Ballard Estate, Heritage District<br />
                  Fort, Mumbai, Maharashtra 400001
                </p>
                <div className="mt-3">
                  <a
                    href="https://maps.google.com/?q=Ballard+Estate+Fort+Mumbai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-ink bg-ink px-3 py-1.5 text-xs text-cream uppercase tracking-wider hover:bg-brass transition"
                  >
                    <span>🧭</span> Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="rounded border border-line bg-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brass">
                  Arrival & Valet Instructions
                </p>
                <ul className="mt-2 text-xs text-mute space-y-1.5 list-disc pl-4">
                  <li>Complimentary valet parking is stationed at the Calicut Road courtyard entrance.</li>
                  <li>Our studio freight elevator is available for voluminous gowns and prop trunks.</li>
                  <li>Security concierge will direct you to Suite 4B upon check-in.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
