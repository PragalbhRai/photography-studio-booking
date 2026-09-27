import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { CinematicSlideshow } from './CinematicSlideshow'
import { WallArtVisualizerModal } from './WallArtVisualizerModal'

export interface ProofFrame {
  id: string
  code: string
  title: string
  category: string
  image: string
  aspectRatio: string
  exif: string
}

export const SAMPLE_PROOFS: ProofFrame[] = [
  {
    id: 'proof-1',
    code: 'NL-2026-081',
    title: 'Palace Courtyard Veil Sweep',
    category: 'Ceremony',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '4/5',
    exif: 'Hasselblad HC 100mm f/2.2 · 1/1000s · ISO 100 · Pro-11 Strobe',
  },
  {
    id: 'proof-2',
    code: 'NL-2026-088',
    title: 'Architectural Archway Silhouette',
    category: 'Ceremony',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '3/4',
    exif: 'Leica M11-P · Summilux 50mm f/1.4 · 1/500s · ISO 200 · Ambient Rim',
  },
  {
    id: 'proof-3',
    code: 'NL-2026-094',
    title: 'Executive Editorial High Key',
    category: 'Editorial',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '4/5',
    exif: 'Sony A1 · FE 85mm f/1.2 GM · 1/250s · ISO 100 · Broncolor Para 133',
  },
  {
    id: 'proof-4',
    code: 'NL-2026-102',
    title: 'Heritage Stepwell Geometry',
    category: 'Editorial',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '3/4',
    exif: 'Hasselblad H6D-100c · 35mm f/3.5 · 1/640s · ISO 64 · Sunset Fill',
  },
  {
    id: 'proof-5',
    code: 'NL-2026-117',
    title: 'Candlelit Palace Corridor',
    category: 'Candids',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '4/5',
    exif: 'Leica Summilux 50mm f/1.4 · 1/160s · ISO 800 · Candlelight & Tungsten',
  },
  {
    id: 'proof-6',
    code: 'NL-2026-125',
    title: 'Monochrome Fine Art Profile',
    category: 'Editorial',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '4/5',
    exif: 'Fujifilm GFX 100 II · GF 110mm f/2 · 1/200s · ISO 100 · Hard Fresnel',
  },
  {
    id: 'proof-7',
    code: 'NL-2026-133',
    title: 'Silk Drapery Wind Movement',
    category: 'Candids',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '3/4',
    exif: 'Sony FX6 Cinema Stills · 50mm T2.3 Anamorphic · 1/1000s · Daylight',
  },
  {
    id: 'proof-8',
    code: 'NL-2026-149',
    title: 'Sunset Stepwell Golden Halo',
    category: 'Ceremony',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: '4/5',
    exif: 'Hasselblad HC 100mm f/2.2 · 1/800s · ISO 100 · Golden Hour Direct',
  },
]

export function ProofingGallery() {
  const [favorites, setFavorites] = useState<string[]>(['proof-1', 'proof-4', 'proof-8'])
  const [activeCategory, setActiveCategory] = useState<'all' | 'fav' | 'Ceremony' | 'Editorial' | 'Candids'>('all')
  const [selectedProof, setSelectedProof] = useState<ProofFrame | null>(null)
  const [slideshowOpen, setSlideshowOpen] = useState<boolean>(false)
  const [visualizerOpen, setVisualizerOpen] = useState<boolean>(false)
  const [visualizerProof, setVisualizerProof] = useState<ProofFrame | undefined>(undefined)
  const [notes, setNotes] = useState<Record<string, string>>({
    'proof-1': 'Please preserve rich crimson hue in the veil and remove background tourist.',
  })
  const [submitted, setSubmitted] = useState<boolean>(false)

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const filteredProofs = SAMPLE_PROOFS.filter((p) => {
    if (activeCategory === 'fav') return favorites.includes(p.id)
    if (activeCategory === 'all') return true
    return p.category === activeCategory
  })

  return (
    <div className="mt-16 rounded border border-brass/50 bg-paper p-6 sm:p-10 shadow-sm">
      {/* Header & Retouching Counter */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-line pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brass animate-pulse" />
            <p className="text-[11px] uppercase tracking-[0.24em] text-brass font-medium">
              Private Client Proofing Vault
            </p>
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
            Digital Proofing & Master Selection
          </h2>
          <p className="mt-2 max-w-xl text-sm text-mute">
            Review raw sensor contact proofs directly from our Ballard Estate studio servers. Heart your favorite frames to designate them for full color grading and retouching.
          </p>
        </div>

        {/* Retouching Quota Bar */}
        <div className="rounded border border-line bg-cream p-4 min-w-[260px]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink">
              Master Retouching Quota
            </span>
            <span className="font-display text-base text-brass font-bold">
              {favorites.length} / 25 Selected
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-paper border border-line overflow-hidden">
            <div
              className="h-full bg-brass transition-all duration-300"
              style={{ width: `${Math.min(100, (favorites.length / 25) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-mute">
            Click the heart (♥) on any frame to add to your high-resolution export vault.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Submission Trigger */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 border border-line bg-cream p-1 rounded">
          {[
            { id: 'all', label: `All Proofs (${SAMPLE_PROOFS.length})` },
            { id: 'fav', label: `♥ Favorited (${favorites.length})` },
            { id: 'Ceremony', label: 'Ceremony' },
            { id: 'Editorial', label: 'Editorial' },
            { id: 'Candids', label: 'Candids' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={cn(
                'rounded px-3 py-1.5 text-xs uppercase tracking-wider transition',
                activeCategory === cat.id
                  ? 'bg-ink text-cream font-semibold shadow-sm'
                  : 'text-mute hover:text-ink hover:bg-paper',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSlideshowOpen(true)}
            className="rounded border border-brass/60 bg-paper px-3 py-1.5 text-xs uppercase tracking-wider text-brass hover:border-brass hover:bg-brass/10 transition flex items-center gap-1.5 font-medium shadow-sm"
          >
            <span>▶</span> Play Slideshow
          </button>
          <button
            type="button"
            onClick={() => {
              setVisualizerProof(filteredProofs[0] || SAMPLE_PROOFS[0])
              setVisualizerOpen(true)
            }}
            className="rounded border border-line bg-cream px-3 py-1.5 text-xs uppercase tracking-wider text-ink hover:border-ink hover:bg-paper transition flex items-center gap-1.5 shadow-sm"
          >
            <span>🖼️</span> Visualize on Wall
          </button>

          {submitted ? (
            <span className="inline-flex items-center gap-1.5 rounded border border-emerald-800/40 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-900">
              <span>✓</span> Selections Locked & Transmitted to Colorists
            </span>
          ) : (
            <Button
              size="sm"
              onClick={() => setSubmitted(true)}
              disabled={favorites.length === 0}
            >
              Lock {favorites.length} Frames for Retouching →
            </Button>
          )}
        </div>
      </div>

      {/* Proofing Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProofs.map((proof: ProofFrame) => {
          const isFav = favorites.includes(proof.id)
          const hasNote = Boolean(notes[proof.id])
          return (
            <div
              key={proof.id}
              onClick={() => setSelectedProof(proof)}
              className="group relative cursor-pointer overflow-hidden rounded border border-line bg-cream transition hover:border-ink/60 hover:shadow-md select-none"
            >
              {/* Image & Watermark Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
                <img
                  src={proof.image}
                  alt={proof.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Diagonal Semi-Transparent Studio Watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-35 transition group-hover:opacity-20">
                  <span className="rotate-[-35deg] whitespace-nowrap font-display text-xs uppercase tracking-[0.3em] text-cream drop-shadow-sm border border-cream/30 px-3 py-1 bg-ink/30 backdrop-blur-[1px]">
                    ✦ NORTHLIGHT PROOF · DO NOT REPRODUCE
                  </span>
                </div>

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(proof.id, e)}
                  className={cn(
                    'absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition shadow-sm',
                    isFav
                      ? 'bg-rose-600 text-white'
                      : 'bg-ink/60 text-cream hover:bg-ink/90',
                  )}
                  title={isFav ? 'Remove from favorites' : 'Heart for retouching'}
                >
                  <span className="text-sm">{isFav ? '♥' : '♡'}</span>
                </button>

                {/* Code Tag */}
                <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-0.5 text-[9px] uppercase tracking-wider text-cream font-mono">
                  {proof.code}
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-brass font-semibold">
                    {proof.category}
                  </span>
                  {hasNote ? (
                    <span className="text-[9px] uppercase tracking-wider text-mute bg-paper px-1.5 py-0.5 rounded border border-line">
                      📝 Note Added
                    </span>
                  ) : null}
                </div>
                <h4 className="mt-1 font-display text-sm font-semibold text-ink line-clamp-1">
                  {proof.title}
                </h4>
                <p className="mt-1 text-[10px] text-mute font-mono truncate">
                  {proof.exif.split('·')[0]}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox / Retouching Note Inspector Modal */}
      {selectedProof ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded border border-line bg-paper shadow-2xl flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProof(null)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream hover:bg-brass transition text-sm"
            >
              ✕
            </button>

            {/* Left: Zoomable Photo with Watermark */}
            <div className="relative md:w-3/5 bg-ink flex items-center justify-center p-4">
              <img
                src={selectedProof.image}
                alt={selectedProof.title}
                className="max-h-[60vh] md:max-h-[80vh] w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
                <span className="rotate-[-35deg] whitespace-nowrap font-display text-sm uppercase tracking-[0.3em] text-cream drop-shadow-md border border-cream/40 px-4 py-1.5 bg-ink/40">
                  ✦ NORTHLIGHT PROOF · WATERMARKED
                </span>
              </div>
            </div>

            {/* Right: EXIF & Client Retouching Notes */}
            <div className="flex flex-col justify-between p-6 md:w-2/5 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="font-mono text-xs text-brass uppercase tracking-wider">
                    {selectedProof.code}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-mute">
                    {selectedProof.category}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-2xl text-ink">
                  {selectedProof.title}
                </h3>

                {/* Technical EXIF */}
                <div className="mt-4 rounded border border-line bg-cream p-3 text-xs text-mute space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-brass font-semibold">
                    Camera Sensor Metadata
                  </p>
                  <p className="font-mono text-[11px] text-ink">{selectedProof.exif}</p>
                </div>

                {/* Retouching Notes Input */}
                <div className="mt-6">
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                    Retouching Direction & Client Notes
                  </label>
                  <p className="mt-1 text-[11px] text-mute">
                    Add specific notes for our lead colorist (e.g. skin tone balance, garment cleanup, background distractions).
                  </p>
                  <textarea
                    rows={4}
                    value={notes[selectedProof.id] || ''}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [selectedProof.id]: e.target.value }))
                    }
                    placeholder="Enter retouching instructions for this frame..."
                    className="mt-2.5 w-full rounded border border-line bg-cream p-3 text-xs text-ink placeholder:text-mute/60 focus:border-ink focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedProof.id)}
                  className={cn(
                    'flex-1 min-w-[140px] rounded py-2 text-xs uppercase tracking-wider transition border text-center font-medium',
                    favorites.includes(selectedProof.id)
                      ? 'border-rose-600 bg-rose-50 text-rose-800'
                      : 'border-line hover:border-ink bg-cream text-ink',
                  )}
                >
                  {favorites.includes(selectedProof.id) ? '♥ Favorited' : '♡ Add to Selections'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVisualizerProof(selectedProof)
                    setVisualizerOpen(true)
                  }}
                  className="rounded border border-line bg-cream px-3 py-2 text-xs uppercase tracking-wider text-ink hover:border-ink hover:bg-paper transition flex items-center gap-1.5"
                >
                  <span>🖼️</span> Preview on Wall
                </button>
                <Button size="sm" onClick={() => setSelectedProof(null)}>
                  Save & Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Cinematic Slideshow Player */}
      <CinematicSlideshow
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        proofs={filteredProofs.length > 0 ? filteredProofs : SAMPLE_PROOFS}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      {/* Living Room Fine-Art Wall Art Visualizer */}
      <WallArtVisualizerModal
        isOpen={visualizerOpen}
        onClose={() => setVisualizerOpen(false)}
        proofs={SAMPLE_PROOFS}
        initialProof={visualizerProof}
      />
    </div>
  )
}
