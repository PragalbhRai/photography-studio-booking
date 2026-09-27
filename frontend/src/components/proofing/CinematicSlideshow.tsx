import { useState, useEffect, useCallback } from 'react'
import type { ProofFrame } from './ProofingGallery'
import { cn } from '@/lib/cn'

interface Props {
  isOpen: boolean
  onClose: () => void
  proofs: ProofFrame[]
  initialIndex?: number
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

export function CinematicSlideshow({
  isOpen,
  onClose,
  proofs,
  initialIndex = 0,
  favorites,
  onToggleFavorite,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [zoomPhase, setZoomPhase] = useState(false)

  const currentProof = proofs[currentIndex] || proofs[0]
  const isFav = currentProof ? favorites.includes(currentProof.id) : false

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % proofs.length)
    setZoomPhase(false)
  }, [proofs.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + proofs.length) % proofs.length)
    setZoomPhase(false)
  }, [proofs.length])

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return

    const timer = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(timer)
  }, [isOpen, isPlaying, handleNext])

  // Trigger Ken Burns slow zoom effect on slide change
  useEffect(() => {
    if (!isOpen) return
    const timeout = setTimeout(() => {
      setZoomPhase(true)
    }, 100)
    return () => clearTimeout(timeout)
  }, [currentIndex, isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setIsPlaying((p) => !p)
      }
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handleNext, handlePrev])

  if (!isOpen || !currentProof) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#080809] text-cream select-none overflow-hidden animate-fadeIn">
      {/* Top Header Bar */}
      <div className="z-20 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-[#080809]/90 to-transparent">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
          <span className="font-display text-base tracking-widest text-cream uppercase">
            Northlight Cinema · Exhibition Premiere
          </span>
          <span className="hidden sm:inline-block rounded bg-cream/10 px-2 py-0.5 text-[10px] tracking-wider text-brass uppercase font-mono">
            {currentProof.code}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Pause / Play status */}
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="rounded border border-cream/20 bg-cream/5 px-3 py-1.5 text-xs uppercase tracking-wider text-cream hover:bg-cream/15 transition flex items-center gap-1.5"
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Heart Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite(currentProof.id)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition border text-sm',
              isFav
                ? 'border-rose-600 bg-rose-600 text-white'
                : 'border-cream/20 bg-cream/10 text-cream hover:border-cream/50',
            )}
            title={isFav ? 'Remove from favorites' : 'Heart for retouching'}
          >
            <span>{isFav ? '♥' : '♡'}</span>
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-brass hover:text-ink transition text-sm"
            title="Exit Slideshow (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Image Stage with Ken Burns Smooth Pan/Zoom */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-ink/60 text-cream hover:bg-brass hover:text-ink transition border border-cream/15 backdrop-blur-sm text-lg"
          title="Previous frame (Left arrow)"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-ink/60 text-cream hover:bg-brass hover:text-ink transition border border-cream/15 backdrop-blur-sm text-lg"
          title="Next frame (Right arrow)"
        >
          ›
        </button>

        {/* Hero Photo with Ken Burns slow scale */}
        <div className="relative max-h-[82vh] max-w-full overflow-hidden rounded shadow-2xl">
          <img
            key={currentProof.id}
            src={currentProof.image}
            alt={currentProof.title}
            className={cn(
              'max-h-[82vh] w-auto object-contain transition-all duration-[5500ms] ease-out',
              zoomPhase ? 'scale-105 translate-y-[-0.5%]' : 'scale-100',
            )}
          />

          {/* Discreet Studio Watermark in Slideshow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
            <span className="rotate-[-30deg] font-display text-xs uppercase tracking-[0.3em] text-cream drop-shadow-md border border-cream/40 px-4 py-1 bg-ink/40">
              ✦ NORTHLIGHT EXHIBITION · DO NOT REPRODUCE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Metadata Bar */}
      <div className="z-20 px-6 py-5 bg-gradient-to-t from-[#080809]/90 to-transparent">
        <div className="mx-auto max-w-site flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-brass font-medium">
              {currentProof.category} · {currentProof.code}
            </p>
            <h4 className="font-display text-2xl text-cream font-medium">
              {currentProof.title}
            </h4>
            <p className="mt-1 text-xs text-cream/60 font-mono">
              {currentProof.exif}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-cream/70 tracking-wider">
              {currentIndex + 1} / {proofs.length}
            </span>
            <div className="h-1.5 w-32 rounded-full bg-cream/15 overflow-hidden">
              <div
                className="h-full bg-brass transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / proofs.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-cream/40 uppercase tracking-widest hidden sm:inline">
              [Space] Pause · [Esc] Exit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
