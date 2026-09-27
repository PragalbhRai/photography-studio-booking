import { useState } from 'react'
import { PHOTOGRAPHER_GEAR, type GearItem } from '@/lib/photographer-gear'
import { cn } from '@/lib/cn'

interface Props {
  photographerId: string
  photographerName: string
}

export function KitbagShowcase({ photographerId, photographerName }: Props) {
  const kit = PHOTOGRAPHER_GEAR[photographerId] || PHOTOGRAPHER_GEAR['photo-1']
  const [filter, setFilter] = useState<'all' | 'camera' | 'lens' | 'lighting'>('all')

  const items = kit.gear.filter((item) => {
    if (filter === 'all') return true
    return item.category === filter
  })

  return (
    <section className="mt-20 border-t border-line pt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brass font-medium">
            Optical Precision & Craft
          </p>
          <h2 className="mt-1 font-display text-4xl text-ink">
            What’s in {photographerName.split(' ')[0]}’s Kitbag
          </h2>
          <p className="mt-2 max-w-xl text-sm text-mute">
            {kit.tagline}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 border border-line bg-cream p-1 rounded">
          {[
            { id: 'all', label: `All Kit (${kit.gear.length})` },
            { id: 'camera', label: 'Cameras & Sensors' },
            { id: 'lens', label: 'Master Glass' },
            { id: 'lighting', label: 'Studio Light' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id as any)}
              className={cn(
                'rounded px-3 py-1.5 text-xs uppercase tracking-wider transition',
                filter === cat.id
                  ? 'bg-ink text-cream font-semibold shadow-sm'
                  : 'text-mute hover:text-ink hover:bg-paper',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Highlight Banner */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded border border-brass/40 bg-paper px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brass/15 text-brass font-display text-base">
            ✦
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-brass font-semibold">
              Primary Capture Medium
            </p>
            <p className="font-display text-lg text-ink font-medium">
              {kit.primarySensor}
            </p>
          </div>
        </div>
        <span className="rounded border border-line bg-cream px-3 py-1 text-[11px] text-mute uppercase tracking-wider">
          Calibrated Studio Color Profile
        </span>
      </div>

      {/* Gear Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item: GearItem) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded border border-line bg-cream p-5 transition hover:border-ink/40 hover:bg-paper"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded bg-paper px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold text-brass border border-line">
                  {item.brand}
                </span>
                <span className="text-[10px] text-mute uppercase tracking-wider">
                  {item.badge}
                </span>
              </div>

              <h4 className="mt-3 font-display text-xl text-ink font-semibold">
                {item.name}
              </h4>
              <p className="mt-1 text-xs font-medium text-brass">
                {item.specs}
              </p>
              <p className="mt-2.5 text-xs text-mute leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[10px] text-mute uppercase tracking-widest">
              <span>{item.category === 'camera' ? '📷 Flagship Body' : item.category === 'lens' ? '🔍 Prime Glass' : '⚡ Light Shaping'}</span>
              <span className="text-emerald-700 font-medium">✓ Calibrated</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
