import { useState, useRef, useCallback } from 'react'

interface ComparisonPreset {
  id: string
  title: string
  category: string
  image: string
  rawDescription: string
  gradedDescription: string
}

const PRESETS: ComparisonPreset[] = [
  {
    id: 'wedding',
    title: 'Palace Wedding Ceremony',
    category: 'Weddings & Celebrations',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
    rawDescription: 'Flat sensor dynamic range with muted color response',
    gradedDescription: 'Rich jewel tones, glowing silk textures, and royal contrast',
  },
  {
    id: 'portrait',
    title: 'Executive & Editorial Portrait',
    category: 'Portraits & Headshots',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
    rawDescription: 'Direct strobe profile with uncalibrated skin gradations',
    gradedDescription: 'Sculpted cheekbone shadows, micro-contrast, and tonal depth',
  },
  {
    id: 'heritage',
    title: 'Heritage Stepwell Editorial',
    category: 'Pre-Wedding & Fashion',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
    rawDescription: 'Hazy mid-day natural light with clipped highlights',
    gradedDescription: 'Warm cinematic sunset grade, preserved fabric detail, and golden halo',
  },
]

export function BeforeAfterSlider() {
  const [activePreset, setActivePreset] = useState<ComparisonPreset>(PRESETS[0])
  const [sliderPos, setSliderPos] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percent)
  }, [])

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging || e.buttons === 1) {
      handleMove(e.clientX)
    }
  }

  return (
    <div className="mx-auto max-w-site px-5 py-20 md:px-8 md:py-28">
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brass font-medium">The Craft of Color</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">The Art of the Grade</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">
            Every Northlight frame undergoes bespoke hand-calibrated grading. Drag the divider to reveal how raw camera data transforms into timeless fine-art imagery.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setActivePreset(p)
                setSliderPos(50)
              }}
              className={`px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition border ${
                activePreset.id === p.id
                  ? 'border-ink bg-ink text-cream'
                  : 'border-line bg-paper text-mute hover:border-ink hover:text-ink'
              }`}
            >
              {p.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Split Container */}
      <div
        ref={containerRef}
        className="relative aspect-[16/9] w-full select-none overflow-hidden border border-line bg-cream shadow-xl cursor-ew-resize md:aspect-[21/9]"
        onMouseDown={(e) => {
          setIsDragging(true)
          handleMove(e.clientX)
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Layer 1: Master Color Graded (Background Full) */}
        <div className="absolute inset-0">
          <img
            src={activePreset.image}
            alt={activePreset.title}
            className="h-full w-full object-cover select-none"
            loading="lazy"
          />
        </div>

        {/* Layer 2: Raw Sensor Capture (Clipped on the left) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="relative h-full w-full"
            style={{
              filter: 'saturate(0.55) contrast(0.82) brightness(1.08) sepia(0.08)',
            }}
          >
            <img
              src={activePreset.image}
              alt={activePreset.title}
              className="h-full w-full object-cover pointer-events-none select-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                maxWidth: 'none',
              }}
            />
          </div>
        </div>

        {/* Floating Badges */}
        <div className="pointer-events-none absolute left-4 top-4 rounded bg-ink/75 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream backdrop-blur-sm">
          Raw Sensor Log
        </div>
        <div className="pointer-events-none absolute right-4 top-4 rounded bg-brass/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream backdrop-blur-sm">
          Northlight Master Grade
        </div>

        {/* Vertical Divider Line & Handle */}
        <div
          className="pointer-events-none absolute bottom-0 top-0 w-0.5 bg-cream shadow-[0_0_12px_rgba(0,0,0,0.6)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/95 text-xs font-semibold text-ink shadow-lg backdrop-blur">
            <span className="tracking-tighter">◀ ▶</span>
          </div>
        </div>
      </div>

      {/* Caption & Explanations */}
      <div className="mt-4 flex flex-col justify-between gap-3 text-xs text-mute sm:flex-row">
        <p>
          <span className="font-medium text-ink">Left:</span> {activePreset.rawDescription}
        </p>
        <p>
          <span className="font-medium text-brass">Right:</span> {activePreset.gradedDescription}
        </p>
      </div>
    </div>
  )
}
