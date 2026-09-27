import { useState, useId } from 'react'
import { Link } from '@tanstack/react-router'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/Button'

export function InvestmentCalculator() {
  const [hours, setHours] = useState<number>(4)
  const [photos, setPhotos] = useState<number>(35)
  const [crew, setCrew] = useState<'solo' | 'duo' | 'full'>('duo')
  const [location, setLocation] = useState<'studio' | 'palace'>('studio')
  const [express, setExpress] = useState<boolean>(false)

  const photosInputId = useId()

  // Dynamic price calculation
  const hourlyBase = hours === 2 ? 18000 : hours === 4 ? 32000 : 58000
  const retouchFee = Math.max(0, photos - 20) * 450
  const crewFee = crew === 'solo' ? 0 : crew === 'duo' ? 12000 : 28000
  const locationFee = location === 'studio' ? 0 : 15000
  const expressFee = express ? 10000 : 0

  const totalEstimate = hourlyBase + retouchFee + crewFee + locationFee + expressFee

  return (
    <div className="mt-16 rounded border border-brass/50 bg-paper p-6 sm:p-10 shadow-sm">
      <div className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.24em] text-brass font-medium">
          Transparent Estimations
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
          Interactive Investment Calculator
        </h2>
        <p className="mt-2 text-sm text-mute">
          Every commission is distinct. Tailor your sitting duration, deliverable count, and production crew to calculate an instant bespoke estimate.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Customizer Controls */}
        <div className="space-y-6">
          {/* Sitting Duration */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
              1. Session Duration
            </label>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {[
                { val: 2, label: '2 Hours', sub: 'Single Look' },
                { val: 4, label: '4 Hours', sub: 'Half Day (2-3 Looks)' },
                { val: 8, label: '8 Hours', sub: 'Full Day Production' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setHours(item.val)}
                  className={`rounded border p-3 text-left transition ${
                    hours === item.val
                      ? 'border-brass bg-cream ring-1 ring-brass'
                      : 'border-line bg-cream/50 hover:border-ink/40'
                  }`}
                >
                  <p className="font-display text-base font-semibold text-ink">{item.label}</p>
                  <p className="text-[10px] text-mute">{item.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Master Retouched Deliverables Slider */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor={photosInputId} className="text-xs font-semibold uppercase tracking-wider text-ink">
                2. Retouched & Graded Frames: <span className="font-display text-base text-brass font-bold">{photos} Images</span>
              </label>
              <span className="text-[11px] text-mute">20 Included · ₹450/extra frame</span>
            </div>
            <input
              id={photosInputId}
              type="range"
              min={15}
              max={80}
              step={5}
              value={photos}
              onChange={(e) => setPhotos(Number(e.target.value))}
              className="mt-3 w-full accent-brass cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-mute">
              <span>15 frames (Editorial min)</span>
              <span>45 frames</span>
              <span>80 frames (Extensive book)</span>
            </div>
          </div>

          {/* Artist Crew Size */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
              3. Artist Crew Configuration
            </label>
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 'solo', label: 'Solo Principal', fee: 'Included' },
                { val: 'duo', label: 'Principal + 2nd Angle', fee: '+₹12,000' },
                { val: 'full', label: '3-Artist Film Crew', fee: '+₹28,000' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setCrew(item.val as any)}
                  className={`rounded border p-3 text-left transition ${
                    crew === item.val
                      ? 'border-brass bg-cream ring-1 ring-brass'
                      : 'border-line bg-cream/50 hover:border-ink/40'
                  }`}
                >
                  <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
                  <p className="text-[10px] text-brass font-medium">{item.fee}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Speed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                4. Production Location
              </label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setLocation('studio')}
                  className={`flex-1 rounded border p-2.5 text-center text-xs transition ${
                    location === 'studio'
                      ? 'border-brass bg-cream font-semibold text-ink'
                      : 'border-line text-mute'
                  }`}
                >
                  🏢 Studio Suite (Ballard Estate)
                </button>
                <button
                  type="button"
                  onClick={() => setLocation('palace')}
                  className={`flex-1 rounded border p-2.5 text-center text-xs transition ${
                    location === 'palace'
                      ? 'border-brass bg-cream font-semibold text-ink'
                      : 'border-line text-mute'
                  }`}
                >
                  🏰 Palace / Destination (+₹15k)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                5. Turnaround Priority
              </label>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setExpress(!express)}
                  className={`w-full rounded border p-2.5 text-center text-xs transition ${
                    express
                      ? 'border-brass bg-cream font-semibold text-ink ring-1 ring-brass'
                      : 'border-line text-mute hover:border-ink/30'
                  }`}
                >
                  {express ? '⚡ 48-Hour Rush Vault (+₹10k)' : '⏳ Standard 7-Day Vault Delivery'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Bespoke Quote Summary */}
        <div className="flex flex-col justify-between rounded border border-line bg-cream p-6 sm:p-7">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-brass font-semibold">
                  Estimated Investment
                </p>
                <p className="mt-1 font-display text-4xl text-ink font-semibold">
                  {formatPrice(totalEstimate)}
                </p>
              </div>
              <span className="rounded bg-brass/10 px-2.5 py-1 text-[11px] font-medium text-brass">
                {hours}h Commission
              </span>
            </div>

            {/* Itemized breakdown */}
            <div className="mt-5 space-y-2.5 text-xs">
              <div className="flex justify-between text-mute">
                <span>Base Studio Session ({hours} Hours)</span>
                <span className="text-ink font-medium">{formatPrice(hourlyBase)}</span>
              </div>
              <div className="flex justify-between text-mute">
                <span>Master Graded Frames ({photos} images)</span>
                <span className="text-ink font-medium">
                  {retouchFee > 0 ? `+${formatPrice(retouchFee)}` : 'Included'}
                </span>
              </div>
              <div className="flex justify-between text-mute">
                <span>Crew: {crew === 'solo' ? 'Solo Principal' : crew === 'duo' ? 'Lead + Associate' : 'Full Cinema Crew'}</span>
                <span className="text-ink font-medium">
                  {crewFee > 0 ? `+${formatPrice(crewFee)}` : 'Included'}
                </span>
              </div>
              <div className="flex justify-between text-mute">
                <span>Location: {location === 'studio' ? 'Ballard Estate Studio' : 'Palace / Outdoor Site'}</span>
                <span className="text-ink font-medium">
                  {locationFee > 0 ? `+${formatPrice(locationFee)}` : 'Included'}
                </span>
              </div>
              {express ? (
                <div className="flex justify-between text-mute">
                  <span>Priority Turnaround (48 Hours)</span>
                  <span className="text-ink font-medium">+{formatPrice(expressFee)}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-5 rounded border border-line bg-paper p-3 text-[11px] text-mute space-y-1">
              <p>✦ Includes raw digital contact sheet within 24h of shoot wrap.</p>
              <p>✦ High-resolution cloud vault archive hosted for 24 months.</p>
              <p>✦ Commercial release & personal usage rights included.</p>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-line">
            <Link to="/book" className="block w-full">
              <Button className="w-full text-center py-3">
                Reserve With This Setup →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
