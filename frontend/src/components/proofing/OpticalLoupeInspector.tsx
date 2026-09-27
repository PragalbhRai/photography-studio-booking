import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import type { ProofFrame } from './ProofingGallery'

interface Props {
  isOpen: boolean
  onClose: () => void
  proof: ProofFrame
}

export type SpectrumMode = 'rgb' | 'false_color' | 'high_pass' | 'luminance'

export function OpticalLoupeInspector({ isOpen, onClose, proof }: Props) {
  const [zoomLevel, setZoomLevel] = useState<number>(3.5)
  const [spectrumMode, setSpectrumMode] = useState<SpectrumMode>('rgb')
  const [loupeActive, setLoupeActive] = useState<boolean>(true)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 })
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [pinpoints, setPinpoints] = useState<{ id: string; x: number; y: number; note: string }[]>([
    { id: 'pin-1', x: 0.48, y: 0.32, note: 'Catchlight corneal reflection sharp · Zero chromatic aberration' },
  ])
  const [newNote, setNewNote] = useState<string>('')
  const [droppingPin, setDroppingPin] = useState<boolean>(false)

  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Track cursor position normalized 0 to 1
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    setMousePos({ x, y })
  }, [])

  // Drop pinpoint note
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!droppingPin || !imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const noteText = newNote.trim() || 'Retouching inspection note'
    setPinpoints((prev) => [
      ...prev,
      { id: `pin-${Date.now()}`, x, y, note: noteText },
    ])
    setNewNote('')
    setDroppingPin(false)
  }

  // Keyboard navigation & ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  // Loupe dimensions
  const loupeSize = 220 // diameter in pixels
  const containerRect = imageContainerRef.current?.getBoundingClientRect()
  const cursorPxX = (containerRect?.width || 600) * mousePos.x
  const cursorPxY = (containerRect?.height || 750) * mousePos.y

  // Background position for magnified zoom inside the loupe
  const bgPosX = mousePos.x * 100
  const bgPosY = mousePos.y * 100

  // Filter styles for spectrum channels
  const getSpectrumFilter = (mode: SpectrumMode) => {
    switch (mode) {
      case 'false_color':
        // High-contrast false-color cinema exposure simulation
        return 'contrast(180%) saturate(300%) hue-rotate(180deg) invert(15%)'
      case 'high_pass':
        // High-pass edge sharpening visualization for skin pore inspection
        return 'grayscale(100%) contrast(350%) brightness(110%)'
      case 'luminance':
        // 16-bit monochrome zone system tonal graduation
        return 'grayscale(100%) contrast(110%)'
      case 'rgb':
      default:
        return 'none'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      {/* Container Modal */}
      <div className="relative w-full max-w-5xl rounded border border-line bg-paper shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-line bg-cream px-6 py-3.5 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-brass uppercase font-bold tracking-wider">
                  {proof.code}
                </span>
                <span className="text-[10px] text-mute uppercase tracking-widest font-mono">
                  100MP Optical Microscope Loupe
                </span>
              </div>
              <h3 className="font-display text-lg text-ink font-semibold line-clamp-1">
                {proof.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              ✕ Close Inspection
            </Button>
          </div>
        </div>

        {/* Sensor Spectrum Channel Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-line bg-paper px-6 py-2.5 text-xs gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mute mr-1">
              Sensor Channel:
            </span>
            {[
              { id: 'rgb', label: 'RGB Master Color', icon: '🎨' },
              { id: 'false_color', label: 'Cinema False-Color IRE', icon: '🌈' },
              { id: 'high_pass', label: 'High-Pass Texture', icon: '🔬' },
              { id: 'luminance', label: '16-Bit Luminance', icon: '⚪' },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setSpectrumMode(ch.id as SpectrumMode)}
                className={cn(
                  'rounded px-2.5 py-1 text-[11px] uppercase tracking-wider transition border flex items-center gap-1',
                  spectrumMode === ch.id
                    ? 'border-brass bg-cream text-ink font-semibold shadow-sm'
                    : 'border-line text-mute hover:text-ink hover:bg-cream/40',
                )}
              >
                <span>{ch.icon}</span> {ch.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-mute font-mono">Zoom:</span>
              {[2, 3.5, 6].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoomLevel(z)}
                  className={cn(
                    'rounded px-2 py-0.5 text-[10px] font-mono border transition',
                    zoomLevel === z
                      ? 'border-ink bg-ink text-cream font-bold'
                      : 'border-line bg-cream text-mute hover:text-ink',
                  )}
                >
                  {z}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLoupeActive((prev) => !prev)}
              className={cn(
                'rounded px-2.5 py-1 text-[11px] uppercase tracking-wider border font-mono transition',
                loupeActive
                  ? 'border-brass bg-brass/10 text-brass font-semibold'
                  : 'border-line bg-cream text-mute hover:text-ink',
              )}
            >
              {loupeActive ? '◉ Loupe Active' : '○ Loupe Off'}
            </button>
          </div>
        </div>

        {/* Main Inspection Stage */}
        <div className="relative flex-1 overflow-hidden bg-ink p-4 sm:p-6 flex items-center justify-center">
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleImageClick}
            className={cn(
              'relative max-h-[65vh] w-auto aspect-[4/5] overflow-hidden rounded border border-white/20 select-none shadow-2xl',
              droppingPin ? 'cursor-crosshair' : 'cursor-none',
            )}
          >
            {/* Base Image with Applied Spectrum Filter */}
            <img
              src={proof.image}
              alt={proof.title}
              className="h-full w-full object-cover transition-all duration-300 pointer-events-none"
              style={{
                filter: getSpectrumFilter(spectrumMode),
              }}
            />

            {/* Microscopic Pinpoints Dropped on Photo */}
            {pinpoints.map((p, idx) => (
              <div
                key={p.id}
                className="absolute z-20 group"
                style={{ top: `${p.y * 100}%`, left: `${p.x * 100}%` }}
              >
                <div className="flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-lg border border-white animate-bounce">
                  {idx + 1}
                </div>
                <div className="pointer-events-none absolute left-6 top-0 hidden -translate-y-1/2 rounded bg-ink/90 px-2.5 py-1 text-[10px] font-mono text-cream whitespace-nowrap group-hover:block z-30 border border-white/20 shadow-xl">
                  {p.note}
                </div>
              </div>
            ))}

            {/* Real-Time Optical Magnification Loupe (Biconvex Glass) */}
            {loupeActive && isHovering && !droppingPin && (
              <div
                className="pointer-events-none absolute z-30 overflow-hidden rounded-full shadow-2xl"
                style={{
                  width: `${loupeSize}px`,
                  height: `${loupeSize}px`,
                  left: `${cursorPxX - loupeSize / 2}px`,
                  top: `${cursorPxY - loupeSize / 2}px`,
                  border: '3px solid #C5A059',
                  boxShadow: '0 0 25px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.4)',
                }}
              >
                {/* Magnified Image Inner Background */}
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url(${proof.image})`,
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    backgroundSize: `${zoomLevel * 100}%`,
                    backgroundRepeat: 'no-repeat',
                    filter: getSpectrumFilter(spectrumMode),
                  }}
                />

                {/* Optical Reticle Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="h-full w-[1px] bg-white/70" />
                  <div className="w-full h-[1px] bg-white/70 absolute" />
                  <div className="h-8 w-8 rounded-full border border-white/60 absolute" />
                </div>

                {/* Glass Glare Sheen Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent opacity-70" />

                {/* Magnification Badge inside Loupe */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/70 px-2 py-0.5 text-[9px] font-mono text-brass font-bold border border-brass/40">
                  {zoomLevel}X OPTICAL
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Technical Bar & Annotation Tools */}
        <div className="border-t border-line bg-cream p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* EXIF Sensor Info */}
          <div className="flex items-center gap-3 text-mute font-mono">
            <span className="text-[10px] uppercase tracking-wider text-brass font-semibold">
              Sensor Matrix:
            </span>
            <span className="text-[11px] text-ink">{proof.exif}</span>
          </div>

          {/* Add Retouching Pinpoint */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add retouching callout..."
              className="rounded border border-line bg-paper px-3 py-1.5 text-xs text-ink placeholder:text-mute focus:outline-none w-full sm:w-64"
            />
            <Button
              size="sm"
              onClick={() => setDroppingPin(true)}
              className={droppingPin ? 'ring-2 ring-rose-500 animate-pulse' : ''}
            >
              {droppingPin ? '🎯 Click Image to Place' : '📍 Drop Pin'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
