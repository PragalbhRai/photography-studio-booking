import { useState, useEffect, useCallback } from 'react'
import type { ProofFrame } from './ProofingGallery'
import { Button } from '@/components/ui/Button'

interface CoffeeTableBookModalProps {
  isOpen: boolean
  onClose: () => void
  proofs: ProofFrame[]
}

interface BookSpread {
  id: number
  spreadTitle: string
  left: {
    type: 'cover' | 'photo' | 'colophon'
    proof?: ProofFrame
    title?: string
    subtitle?: string
    caption?: string
  }
  right: {
    type: 'frontispiece' | 'photo' | 'backCover'
    proof?: ProofFrame
    title?: string
    subtitle?: string
    caption?: string
    quote?: string
  }
}

export function CoffeeTableBookModal({ isOpen, onClose, proofs }: CoffeeTableBookModalProps) {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')

  const safeProofs = proofs.length > 0 ? proofs : []

  // Define curated luxury spreads
  const spreads: BookSpread[] = [
    {
      id: 0,
      spreadTitle: 'Binding & Frontispiece',
      left: {
        type: 'cover',
        title: 'THE HERITAGE ATELIER',
        subtitle: 'Bespoke Archival Monograph · Volume I',
        caption: 'Master Edition · Handcrafted Binding in Florentine Linen',
      },
      right: {
        type: 'frontispiece',
        title: 'A Chronicle of Light',
        subtitle: 'Curated Private Sitting · Ballard Estate Atelier',
        quote: '“To photograph is to hold one’s breath when all faculties converge in the face of fleeting reality.”',
        caption: 'Recorded on Medium Format Digital & 120 Silver Gelatin',
      },
    },
    {
      id: 1,
      spreadTitle: 'The Ceremonial Overture',
      left: {
        type: 'photo',
        proof: safeProofs[0],
        title: safeProofs[0]?.title || 'Palace Courtyard Veil Sweep',
        caption: 'Hasselblad HC 100mm f/2.2 · Natural Desert Wind',
      },
      right: {
        type: 'photo',
        proof: safeProofs[1],
        title: safeProofs[1]?.title || 'Architectural Archway Silhouette',
        caption: 'Leica Summilux 50mm · Central Axis Alignment',
        quote: 'Sandstone geometries echoing three centuries of dynastic craftsmanship.',
      },
    },
    {
      id: 2,
      spreadTitle: 'Editorial & Haute Couture',
      left: {
        type: 'photo',
        proof: safeProofs[2] || safeProofs[0],
        title: safeProofs[2]?.title || 'Executive Editorial High Key',
        caption: 'Sony A1 · 85mm f/1.2 GM · Para 133 Strobe Balance',
      },
      right: {
        type: 'photo',
        proof: safeProofs[3] || safeProofs[1],
        title: safeProofs[3]?.title || 'Heritage Stepwell Geometry',
        caption: 'Hasselblad 100c · Symmetrical Basalt Steps',
        quote: 'Interplay of hard shadow cutaways and flowing silk drapery.',
      },
    },
    {
      id: 3,
      spreadTitle: 'Atmospheric Candids & Golden Hour',
      left: {
        type: 'photo',
        proof: safeProofs[4] || safeProofs[0],
        title: safeProofs[4]?.title || 'Candlelit Palace Corridor',
        caption: '50mm f/1.4 · Ambient Tungsten & Candle Glow',
      },
      right: {
        type: 'photo',
        proof: safeProofs[7] || safeProofs[safeProofs.length - 1],
        title: safeProofs[7]?.title || 'Sunset Stepwell Golden Halo',
        caption: 'Hasselblad 100mm · Direct Low-Angle Sunlight',
        quote: 'The fleeting seven minutes when daylight dissolves into amber gold.',
      },
    },
    {
      id: 4,
      spreadTitle: 'Archival Provenance & Colophon',
      left: {
        type: 'colophon',
        title: 'Archival Colophon',
        subtitle: 'Fine-Art Paper & Chemical Certification',
        caption: 'Printed on Hahnemühle 308gsm 100% Cotton Photo Rag with archival UltraChrome pigment inks. Certified longevity: 150+ years in museum conditions.',
      },
      right: {
        type: 'backCover',
        title: 'THE HERITAGE ATELIER',
        subtitle: 'Ballard Estate · Mumbai · Asia/Kolkata',
        caption: 'End of Monograph · All Rights Reserved © MMXXVI',
      },
    },
  ]

  const maxSpreads = spreads.length

  const handleNext = useCallback(() => {
    if (currentSpreadIndex < maxSpreads - 1 && !isFlipping) {
      setFlipDirection('next')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentSpreadIndex((prev) => prev + 1)
        setIsFlipping(false)
      }, 700)
    }
  }, [currentSpreadIndex, maxSpreads, isFlipping])

  const handlePrev = useCallback(() => {
    if (currentSpreadIndex > 0 && !isFlipping) {
      setFlipDirection('prev')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentSpreadIndex((prev) => prev - 1)
        setIsFlipping(false)
      }, 700)
    }
  }, [currentSpreadIndex, isFlipping])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handleNext, handlePrev])

  if (!isOpen) return null

  const currentSpread = spreads[currentSpreadIndex]

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0a0908]/95 p-4 sm:p-8 backdrop-blur-xl select-none overflow-y-auto animate-fadeIn text-[#e8e4dc]">
      {/* Top Header Controls */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between border-b border-[#332f29] pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-brass">
              Fine-Art Archival Album
            </p>
            <h2 className="font-display text-xl sm:text-2xl text-cream tracking-wide">
              3D Coffee Table Monograph
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-brass tracking-widest hidden sm:inline">
            SPREAD {currentSpreadIndex + 1} OF {maxSpreads}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handlePrev}
              disabled={currentSpreadIndex === 0 || isFlipping}
              className="border-line/60 bg-paper/20 hover:bg-paper/40 text-cream"
            >
              ‹ Previous Page
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleNext}
              disabled={currentSpreadIndex === maxSpreads - 1 || isFlipping}
              className="border-line/60 bg-paper/20 hover:bg-paper/40 text-cream"
            >
              Next Page ›
            </Button>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-paper/20 p-2 text-white/70 hover:bg-brass hover:text-black transition"
            aria-label="Close Book"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main 3D Book Stage */}
      <div className="my-auto flex flex-col items-center justify-center py-6">
        {/* 3D Perspective Stage Container */}
        <div
          className="relative w-full max-w-5xl"
          style={{ perspective: '2200px' }}
        >
          {/* Book Shadow & Leather Edges */}
          <div className="relative mx-auto rounded-lg bg-[#141210] p-3 sm:p-4 shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-[#2b2722]">
            {/* The Open Dual-Page Spread */}
            <div
              className={`relative grid grid-cols-1 md:grid-cols-2 rounded overflow-hidden min-h-[440px] sm:min-h-[540px] md:min-h-[580px] bg-[#fbf9f4] text-[#1c1a17] transition-all duration-700 ${
                isFlipping ? 'filter brightness-95' : ''
              }`}
              style={{
                boxShadow:
                  'inset 0 0 100px rgba(0,0,0,0.06), 0 10px 40px rgba(0,0,0,0.3)',
                transform: isFlipping
                  ? flipDirection === 'next'
                    ? 'rotateY(-4deg) scale(0.985)'
                    : 'rotateY(4deg) scale(0.985)'
                  : 'rotateY(0deg) scale(1)',
                transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Left Page */}
              <div className="relative flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#d9d4c7] p-8 sm:p-12 bg-gradient-to-r from-[#f5f2e9] via-[#faf8f2] to-[#f0ece1]">
                {/* Spine Shadow on Left */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/15 to-transparent" />

                {currentSpread.left.type === 'cover' ? (
                  <div className="my-auto flex flex-col items-center justify-center text-center p-6 border-2 border-brass/40 bg-[#1e1c19] text-[#e8e4dc] rounded shadow-inner">
                    <span className="text-3xl text-brass mb-3">✦</span>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-brass">Private Commission</p>
                    <h1 className="mt-2 font-display text-2xl sm:text-3xl tracking-wider text-cream font-bold">
                      {currentSpread.left.title}
                    </h1>
                    <div className="my-4 h-px w-24 bg-brass/60" />
                    <p className="font-display text-sm tracking-widest uppercase text-brass">
                      {currentSpread.left.subtitle}
                    </p>
                    <p className="mt-6 text-xs text-white/50 max-w-xs leading-relaxed italic">
                      {currentSpread.left.caption}
                    </p>
                  </div>
                ) : currentSpread.left.type === 'colophon' ? (
                  <div className="my-auto space-y-4 p-4 text-xs text-[#443e37] leading-relaxed">
                    <span className="text-xs uppercase tracking-[0.24em] text-brass font-bold">
                      Archival Certification
                    </span>
                    <h3 className="font-display text-2xl text-[#1c1a17]">
                      {currentSpread.left.title}
                    </h3>
                    <p className="italic text-sm">{currentSpread.left.subtitle}</p>
                    <p className="text-xs leading-relaxed mt-4">
                      {currentSpread.left.caption}
                    </p>
                    <div className="mt-8 border-t border-[#d4cebf] pt-4 font-mono text-[10px] text-mute space-y-1">
                      <p>Color Space: DCI-P3 / Adobe RGB (1998)</p>
                      <p>Binding: Section-Sewn Archival Hardback</p>
                      <p>Curator: Master Studio Color Team</p>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto flex flex-col items-center">
                    <div className="relative overflow-hidden rounded shadow-md border border-[#d8d2c4] bg-black/5 p-2">
                      <img
                        src={currentSpread.left.proof?.image}
                        alt={currentSpread.left.title}
                        className="max-h-[360px] sm:max-h-[420px] w-auto object-cover rounded"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h4 className="font-display text-base text-[#1c1a17] font-semibold">
                        {currentSpread.left.title}
                      </h4>
                      <p className="text-[11px] text-[#6b6459] font-mono mt-0.5">
                        {currentSpread.left.caption}
                      </p>
                    </div>
                  </div>
                )}

                {/* Left Page Number */}
                <div className="text-left text-[10px] text-[#8c8474] font-mono">
                  {currentSpreadIndex === 0 ? '' : `PAGE ${currentSpreadIndex * 2}`}
                </div>
              </div>

              {/* Right Page */}
              <div className="relative flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-l from-[#f5f2e9] via-[#faf8f2] to-[#f0ece1]">
                {/* Spine Shadow on Right */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/15 to-transparent" />

                {currentSpread.right.type === 'frontispiece' ? (
                  <div className="my-auto flex flex-col items-center justify-center text-center p-6">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-brass">
                      Monograph Frontispiece
                    </span>
                    <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#1c1a17] font-serif">
                      {currentSpread.right.title}
                    </h2>
                    <p className="mt-2 text-xs uppercase tracking-widest text-[#736c5f]">
                      {currentSpread.right.subtitle}
                    </p>
                    <div className="my-6 h-px w-16 bg-[#bda479]" />
                    <p className="font-serif italic text-sm text-[#443e37] max-w-sm leading-relaxed">
                      {currentSpread.right.quote}
                    </p>
                    <p className="mt-8 text-[11px] text-[#8c8474] font-mono">
                      {currentSpread.right.caption}
                    </p>
                  </div>
                ) : currentSpread.right.type === 'backCover' ? (
                  <div className="my-auto flex flex-col items-center justify-center text-center p-6 border-2 border-brass/40 bg-[#1e1c19] text-[#e8e4dc] rounded shadow-inner">
                    <span className="text-2xl text-brass mb-2">✦</span>
                    <h3 className="font-display text-xl tracking-widest text-cream">
                      {currentSpread.right.title}
                    </h3>
                    <p className="mt-1 text-xs text-brass tracking-wider">
                      {currentSpread.right.subtitle}
                    </p>
                    <p className="mt-6 text-[10px] text-white/40 font-mono">
                      {currentSpread.right.caption}
                    </p>
                  </div>
                ) : (
                  <div className="my-auto flex flex-col items-center">
                    <div className="relative overflow-hidden rounded shadow-md border border-[#d8d2c4] bg-black/5 p-2">
                      <img
                        src={currentSpread.right.proof?.image}
                        alt={currentSpread.right.title}
                        className="max-h-[360px] sm:max-h-[420px] w-auto object-cover rounded"
                      />
                    </div>
                    {currentSpread.right.quote && (
                      <p className="mt-3 font-serif italic text-xs text-[#524b42] text-center max-w-xs">
                        {currentSpread.right.quote}
                      </p>
                    )}
                    <div className="mt-2 text-center">
                      <h4 className="font-display text-base text-[#1c1a17] font-semibold">
                        {currentSpread.right.title}
                      </h4>
                      <p className="text-[11px] text-[#6b6459] font-mono mt-0.5">
                        {currentSpread.right.caption}
                      </p>
                    </div>
                  </div>
                )}

                {/* Right Page Number */}
                <div className="text-right text-[10px] text-[#8c8474] font-mono">
                  {currentSpreadIndex === 0 ? '' : `PAGE ${currentSpreadIndex * 2 + 1}`}
                </div>
              </div>
            </div>

            {/* Subtle Ribbon Bookmark Hanging Down */}
            <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 h-14 w-4 bg-[#8a1c14] shadow-md rounded-b" />
          </div>
        </div>
      </div>

      {/* Bottom Thumbnail Strip & Spread Navigation */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 border-t border-[#332f29] pt-4">
        <div className="flex items-center gap-2 overflow-x-auto p-1 max-w-full">
          {spreads.map((spread, idx) => (
            <button
              key={spread.id}
              onClick={() => {
                if (!isFlipping) {
                  setFlipDirection(idx > currentSpreadIndex ? 'next' : 'prev')
                  setIsFlipping(true)
                  setTimeout(() => {
                    setCurrentSpreadIndex(idx)
                    setIsFlipping(false)
                  }, 400)
                }
              }}
              className={`flex flex-col items-center rounded border px-3 py-1.5 transition text-[11px] whitespace-nowrap ${
                currentSpreadIndex === idx
                  ? 'border-brass bg-brass/20 text-cream font-medium shadow-sm'
                  : 'border-[#332f29] bg-paper/10 text-white/50 hover:border-white/40 hover:text-white'
              }`}
            >
              <span>{spread.spreadTitle}</span>
              <span className="text-[9px] font-mono text-brass/80">Spread {idx + 1}</span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-white/40 tracking-wider">
          Tip: Use [←] and [→] arrow keys on your keyboard to turn album pages.
        </p>
      </div>
    </div>
  )
}
