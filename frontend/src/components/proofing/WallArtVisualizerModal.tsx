import { useState } from 'react'
import type { ProofFrame } from './ProofingGallery'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  proofs: ProofFrame[]
  initialProof?: ProofFrame
}

type FrameStyle = 'gold' | 'black' | 'maple' | 'canvas'
type FrameSize = 'large' | 'medium' | 'classic'

export function WallArtVisualizerModal({
  isOpen,
  onClose,
  proofs,
  initialProof,
}: Props) {
  const [selectedProof, setSelectedProof] = useState<ProofFrame>(initialProof || proofs[0])
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('gold')
  const [frameSize, setFrameSize] = useState<FrameSize>('medium')
  const [hasMatting, setHasMatting] = useState<boolean>(true)
  const [orderSent, setOrderSent] = useState<boolean>(false)

  if (!isOpen) return null

  // Dimension scaling styles
  const sizeStyles = {
    large: 'max-w-[420px] max-h-[500px]',
    medium: 'max-w-[340px] max-h-[420px]',
    classic: 'max-w-[270px] max-h-[340px]',
  }

  // Frame border styles
  const frameBorderStyles: Record<FrameStyle, string> = {
    gold: 'border-[14px] border-[#C29B38] ring-2 ring-[#7F641B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]',
    black: 'border-[12px] border-[#171719] ring-1 ring-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]',
    maple: 'border-[12px] border-[#D6C4A5] ring-1 ring-[#AA9777] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]',
    canvas: 'border-0 ring-1 ring-ink/20 shadow-[0_30px_70px_-12px_rgba(0,0,0,0.8)]',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-md p-4 select-none">
      <div className="relative flex flex-col lg:flex-row h-[94vh] w-full max-w-6xl overflow-hidden rounded border border-brass/40 bg-paper shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream hover:bg-brass transition text-sm shadow-md"
        >
          ✕
        </button>

        {/* Left: Interactive Realistic Architectural Interior Wall */}
        <div className="relative flex-1 bg-[#DED6C7] flex flex-col justify-between overflow-hidden">
          {/* Wall Texture & Shadow Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#CFC6B5] via-[#DDD5C5] to-[#C7BDA9] opacity-90" />
          
          {/* Subtle architectural wall molding line */}
          <div className="absolute top-8 inset-x-0 h-1 bg-black/5 border-b border-white/20" />

          {/* Wall Hanging Stage */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-8 pt-16">
            <div
              className={cn(
                'relative transition-all duration-500 ease-out flex items-center justify-center',
                sizeStyles[frameSize],
                frameBorderStyles[frameStyle],
                hasMatting && frameStyle !== 'canvas' ? 'bg-[#F9F7F1] p-6' : 'p-0',
              )}
            >
              {/* The Art Piece */}
              <div className="relative overflow-hidden bg-ink/10 shadow-inner">
                <img
                  src={selectedProof.image}
                  alt={selectedProof.title}
                  className="w-full h-auto object-cover max-h-[380px]"
                />

                {/* Subtle Glass Reflection Glare */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              </div>

              {/* Museum Brass Plaque */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gradient-to-r from-[#B99335] via-[#DDBE68] to-[#B99335] px-2.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-ink shadow-sm border border-[#7F641B]/40">
                Northlight Master Print · {selectedProof.code}
              </div>
            </div>
          </div>

          {/* Architectural Interior Furniture: Minimalist Walnut Credenza Base */}
          <div className="relative z-10 w-full">
            {/* Table Surface & Shadow */}
            <div className="mx-auto max-w-[80%] h-5 bg-[#5A3825] rounded-t-sm shadow-lg border-t border-[#7A4D33]" />
            <div className="mx-auto max-w-[78%] h-12 bg-[#422819] shadow-2xl flex items-center justify-between px-6 border-b-2 border-black/30">
              {/* Designer decorative ceramics on the credenza */}
              <div className="flex items-end gap-3 -mt-6">
                <div className="h-10 w-4 rounded-full bg-[#EAE4D8] border border-black/10 shadow-sm" />
                <div className="h-6 w-8 rounded-sm bg-[#B89B72] border border-black/10 shadow-sm" />
              </div>
              <div className="h-8 w-3 rounded-full bg-[#D4AF37]/80 shadow-sm" />
            </div>
            {/* Parquet Floor Base */}
            <div className="h-7 w-full bg-[#75523A] border-t border-black/20" />
          </div>

          {/* Thumbnail Photo Selector Strip at bottom */}
          <div className="relative z-15 bg-[#17171A]/90 px-4 py-2.5 backdrop-blur-md flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[9px] uppercase tracking-widest text-brass whitespace-nowrap">
              Switch Photo:
            </span>
            {proofs.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProof(p)}
                className={cn(
                  'h-11 w-9 overflow-hidden rounded border transition flex-shrink-0',
                  selectedProof.id === p.id
                    ? 'border-brass ring-1 ring-brass scale-105'
                    : 'border-white/20 opacity-60 hover:opacity-100',
                )}
              >
                <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Fine-Art Framing Controls & Spec Panel */}
        <div className="flex flex-col justify-between p-6 lg:w-[380px] bg-paper overflow-y-auto">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-brass font-medium">
                Bespoke Exhibition Finishing
              </p>
              <h3 className="mt-1 font-display text-2xl text-ink">
                Fine-Art Wall Visualizer
              </h3>
              <p className="mt-1 text-xs text-mute">
                Preview your sitting portrait as an archival museum framed print.
              </p>
            </div>

            {/* 1. Frame Style Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                1. Frame Moulding Material
              </label>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {[
                  { id: 'gold', label: 'Museum Gold Leaf', note: 'Gilded Baroque Finish' },
                  { id: 'black', label: 'Matte Gallery Noir', note: 'Brushed Solid Ash' },
                  { id: 'maple', label: 'Raw Nordic Maple', note: 'Natural Blonde Timber' },
                  { id: 'canvas', label: 'Gallery Canvas Wrap', note: 'Frameless 1.5” Depth' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrameStyle(f.id as any)}
                    className={cn(
                      'rounded border p-2.5 text-left transition',
                      frameStyle === f.id
                        ? 'border-brass bg-cream ring-1 ring-brass font-medium'
                        : 'border-line bg-cream/50 text-mute hover:border-ink/40',
                    )}
                  >
                    <p className="font-display text-xs text-ink font-semibold">{f.label}</p>
                    <p className="text-[9px] text-mute">{f.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Print Size Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                2. Print Dimensions
              </label>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[
                  { id: 'large', label: '30 × 40”', note: 'Grand Salon' },
                  { id: 'medium', label: '24 × 36”', note: 'Living Room Hero' },
                  { id: 'classic', label: '16 × 24”', note: 'Study / Gallery' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFrameSize(s.id as any)}
                    className={cn(
                      'rounded border p-2.5 text-center transition',
                      frameSize === s.id
                        ? 'border-brass bg-cream ring-1 ring-brass font-medium text-ink'
                        : 'border-line bg-cream/50 text-mute hover:border-ink/40',
                    )}
                  >
                    <p className="font-display text-sm font-semibold">{s.label}</p>
                    <p className="text-[9px] text-mute">{s.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Archival Matting Toggle */}
            {frameStyle !== 'canvas' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                  3. Matting & Border
                </label>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHasMatting(true)}
                    className={cn(
                      'flex-1 rounded border p-2 text-xs transition text-center',
                      hasMatting
                        ? 'border-brass bg-cream font-semibold text-ink'
                        : 'border-line text-mute',
                    )}
                  >
                    2.5” Museum Rag Mat
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasMatting(false)}
                    className={cn(
                      'flex-1 rounded border p-2 text-xs transition text-center',
                      !hasMatting
                        ? 'border-brass bg-cream font-semibold text-ink'
                        : 'border-line text-mute',
                    )}
                  >
                    Full-Bleed Print
                  </button>
                </div>
              </div>
            )}

            {/* Specification Notes */}
            <div className="rounded border border-line bg-cream p-3 text-[11px] text-mute space-y-1">
              <p>✦ Printed on 310gsm Hahnemühle Photo Rag FineArt paper.</p>
              <p>✦ 99% UV-protective museum acrylic glass prevents fading.</p>
              <p>✦ Hand-assembled by master framers in Mumbai.</p>
            </div>
          </div>

          {/* Action / Order CTA */}
          <div className="mt-6 pt-4 border-t border-line space-y-2">
            {orderSent ? (
              <div className="rounded border border-emerald-800/40 bg-emerald-50 p-3 text-center text-xs text-emerald-900 font-medium">
                ✓ Framing request logged for {selectedProof.code}. Our studio concierge will contact you with shipping details.
              </div>
            ) : (
              <Button
                className="w-full text-center py-2.5"
                onClick={() => setOrderSent(true)}
              >
                Inquire Frame for {selectedProof.code} →
              </Button>
            )}
            <Button
              variant="secondary"
              className="w-full text-center py-2 text-xs"
              onClick={onClose}
            >
              Back to Proofing Gallery
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
