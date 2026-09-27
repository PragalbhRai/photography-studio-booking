import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/cn'

export interface ReelItem {
  id: string
  title: string
  location: string
  photographer: string
  gear: string
  category: string
  image: string
}

export const REEL_ITEMS: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'The Royal Mandap & Veil Ceremony',
    location: 'City Palace, Udaipur',
    photographer: 'Aarav Sharma',
    gear: 'Hasselblad H6D-100c · HC 100mm f/2.2 · ISO 100',
    category: 'Royal Wedding',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'reel-2',
    title: 'Heritage Crimson Silk & Zari Weave',
    location: 'Ballard Estate Studio, Mumbai',
    photographer: 'Meera Joshi',
    gear: 'Fujifilm GFX 100 II · GF 110mm f/2 · Broncolor Para 133',
    category: 'Haute Couture',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'reel-3',
    title: 'Executive High-Key Editorial',
    location: 'Northlight Studio A, Mumbai',
    photographer: 'Ananya Iyer',
    gear: 'Sony A1 · FE 85mm f/1.2 GM · Elinchrom Rotalux',
    category: 'Personal Branding',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'reel-4',
    title: 'Twilight Coastal Romance',
    location: 'Marine Drive Pavilion, Mumbai',
    photographer: 'Aarav Sharma',
    gear: 'Leica M11-P · Summilux 50mm f/1.4 · Ambient Rim',
    category: 'Pre-Wedding',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'reel-5',
    title: 'Candlelit Palace Corridor Whispers',
    location: 'Jagmandir Island Palace, Udaipur',
    photographer: 'Kabir Mehta',
    gear: 'Sony FX6 Cinema · Cooke Anamorphic 50mm T2.3',
    category: 'Editorial Candids',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'reel-6',
    title: 'Architectural Geometric Shadows',
    location: 'Heritage Stepwell, Rajasthan',
    photographer: 'Meera Joshi',
    gear: 'Hasselblad HC 35mm f/3.5 · Profoto Pro-11 Pack',
    category: 'Fine Art Editorial',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85',
  },
]

export function Cylindrical3DCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const total = REEL_ITEMS.length

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 4500)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const delta = touchEndX - touchStartX.current
    if (delta > 40) prevSlide()
    if (delta < -40) nextSlide()
    touchStartX.current = null
  }

  const activeItem = REEL_ITEMS[currentIndex]

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden py-10 select-none"
    >
      {/* 3D Scene Viewport */}
      <div
        className="relative mx-auto h-[480px] sm:h-[550px] md:h-[580px] w-full max-w-5xl flex items-center justify-center"
        style={{
          perspective: '1300px',
        }}
      >
        <div
          className="relative h-full w-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {REEL_ITEMS.map((item, index) => {
            // Calculate shortest angular offset around the ring
            let offset = index - currentIndex
            if (offset > total / 2) offset -= total
            if (offset < -total / 2) offset += total

            // Keep only items in the visible 180° field (-2 to +2)
            const isVisible = Math.abs(offset) <= 2

            // Cylindrical math coordinates
            const angleDeg = offset * 36
            const rad = (angleDeg * Math.PI) / 180
            const radius = 540 // cylinder radius in pixels
            const translateX = Math.sin(rad) * radius
            const translateZ = Math.cos(rad) * radius - radius
            const rotateY = -angleDeg * 0.95
            const scale = 1 - Math.abs(offset) * 0.12
            const opacity = isVisible ? (offset === 0 ? 1 : Math.max(0.4, 0.9 - Math.abs(offset) * 0.28)) : 0
            const blur = Math.abs(offset) * 2.5

            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'absolute w-[290px] sm:w-[360px] md:w-[440px] aspect-[4/5] rounded overflow-hidden shadow-2xl transition-all duration-700 ease-out cursor-pointer',
                  offset === 0 ? 'ring-1 ring-brass/60' : 'hover:opacity-90',
                )}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  filter: `blur(${blur}px)`,
                  zIndex: 40 - Math.abs(offset) * 10,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity, filter',
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                {/* Master Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                {/* Subtle Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-transparent" />

                {/* Film Stock Stamp & Category Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="rounded bg-ink/70 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-cream/90 font-mono border border-cream/20">
                    {item.category}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-cream/60">
                    35MM FILM REEL · 0{index + 1}
                  </span>
                </div>

                {/* Card Bottom Meta */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-cream z-10">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-brass font-medium">
                    {item.location}
                  </p>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl font-normal leading-tight drop-shadow-sm text-cream">
                    {item.title}
                  </h3>
                  <div className="mt-3 pt-3 border-t border-cream/15 flex items-center justify-between text-[11px] text-cream/70 font-mono">
                    <span>By {item.photographer}</span>
                    <span className="truncate max-w-[170px] text-right text-[10px] text-brass/90">
                      {item.gear.split('·')[0]}
                    </span>
                  </div>
                </div>

                {/* Glass Light Sheen Accent */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Active Photo Live Sensor Card Below Stage */}
      <div className="mx-auto mt-6 max-w-lg text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brass animate-pulse" />
          <span className="font-mono text-[11px] text-ink">
            {activeItem.gear}
          </span>
        </div>
      </div>

      {/* Navigation Controls & Progress Dots */}
      <div className="mt-6 flex items-center justify-center gap-6">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-brass hover:bg-cream hover:text-brass shadow-sm active:scale-95"
          aria-label="Previous photograph"
        >
          <span className="text-lg">←</span>
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {REEL_ITEMS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                dotIdx === currentIndex
                  ? 'w-7 bg-brass'
                  : 'w-2 bg-line hover:bg-mute',
              )}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-brass hover:bg-cream hover:text-brass shadow-sm active:scale-95"
          aria-label="Next photograph"
        >
          <span className="text-lg">→</span>
        </button>
      </div>

      {/* Autoplay & Interaction Hint */}
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-mute">
        {isPaused ? 'Interactive 3D Mode · Drag or Click any slide' : 'Autoplay active · Hover or drag to pause'}
      </p>
    </div>
  )
}
