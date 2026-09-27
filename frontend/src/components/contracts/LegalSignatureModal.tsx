import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { saveContract, generateSha256, type SignedContract } from '@/lib/contracts'

interface Props {
  isOpen: boolean
  onClose: () => void
  sittingId?: string
  clientName?: string
  packageName?: string
  photographerName?: string
  onSigned?: (contract: SignedContract) => void
}

export function LegalSignatureModal({
  isOpen,
  onClose,
  sittingId = 'NL-SIT-2026-081',
  clientName = 'Pooja Malhotra',
  packageName = 'Royal Palace Wedding Masterwork',
  photographerName = 'Aarav Sharma',
  onSigned,
}: Props) {
  const [hasAgreedTerms, setHasAgreedTerms] = useState<boolean>(true)
  const [hasAgreedCopyright, setHasAgreedCopyright] = useState<boolean>(true)
  const [clientSignerName, setClientSignerName] = useState<string>(clientName)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [hasDrawn, setHasDrawn] = useState<boolean>(false)
  const [signedContract, setSignedContract] = useState<SignedContract | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Clear signature canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }, [])

  // Drawing event handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.strokeStyle = '#0F172A'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    setIsDrawing(true)
    setHasDrawn(true)
  }

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  // Handle Contract Adoption & Signing
  const handleAdoptAndSign = async () => {
    if (!canvasRef.current || !hasDrawn) return
    setIsSubmitting(true)

    const signatureDataUrl = canvasRef.current.toDataURL('image/png')
    const signedAt = new Date().toISOString()
    const certificateNumber = `NL-CERT-${Math.floor(100000 + Math.random() * 900000)}`

    // Generate real cryptographic SHA-256 hash of audit string
    const auditString = `${clientSignerName}|${sittingId}|${packageName}|${photographerName}|${signedAt}|${certificateNumber}`
    const sha256Hash = await generateSha256(auditString)

    const contract: SignedContract = {
      id: `contract-${Date.now()}`,
      sittingId,
      clientName: clientSignerName,
      packageName,
      photographerName,
      signatureDataUrl,
      signedAt,
      sha256Hash,
      certificateNumber,
      archivalRating: 'ISO 9706 Certified · 100+ Years Museum Life',
      paperStock: 'Hahnemühle Photo Rag 308gsm 100% Cotton Rag',
    }

    saveContract(contract)
    setSignedContract(contract)
    setIsSubmitting(false)
    if (onSigned) onSigned(contract)
  }

  // Print Certificate action
  const handlePrintCertificate = () => {
    window.print()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded border border-line bg-paper shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-cream px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
            <h3 className="font-display text-xl text-ink font-semibold">
              {signedContract ? 'Certificate of Authenticity' : 'Fine-Art Sitting & Copyright Agreement'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-mute hover:text-ink text-sm border border-line"
          >
            ✕
          </button>
        </div>

        {/* View 1: If already signed, display Museum Certificate of Authenticity */}
        {signedContract ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* The Certificate Parchment */}
            <div className="relative rounded border-2 border-brass/70 bg-[#FDFBF7] p-8 sm:p-10 shadow-lg text-center overflow-hidden">
              {/* Corner Watermarks */}
              <div className="absolute top-3 left-3 text-brass/30 font-serif text-xl">✦</div>
              <div className="absolute top-3 right-3 text-brass/30 font-serif text-xl">✦</div>
              <div className="absolute bottom-3 left-3 text-brass/30 font-serif text-xl">✦</div>
              <div className="absolute bottom-3 right-3 text-brass/30 font-serif text-xl">✦</div>

              {/* Seal Crest */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass bg-cream/70 shadow-sm">
                <span className="font-display text-2xl text-brass font-bold">NL</span>
              </div>

              <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-brass font-semibold">
                Northlight Studio · Ballard Estate, Mumbai
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl text-ink font-semibold">
                Certificate of Archival Authenticity
              </h2>
              <p className="mt-1 font-mono text-xs text-brass">
                Serial No: {signedContract.certificateNumber}
              </p>

              <div className="my-6 border-t border-b border-brass/30 py-4 text-xs text-mute max-w-lg mx-auto space-y-2 leading-relaxed">
                <p>
                  This document certifies that the photographic sitting <strong className="text-ink">{signedContract.packageName}</strong> (Reference: <span className="font-mono text-ink">{signedContract.sittingId}</span>) commissioned by <strong className="text-ink">{signedContract.clientName}</strong> and authored by Master Photographer <strong className="text-ink">{signedContract.photographerName}</strong> is authenticated as a genuine Northlight studio masterwork.
                </p>
                <p className="text-[11px] font-mono text-ink/80 pt-1">
                  Substrate: {signedContract.paperStock}
                  <br />
                  Rating: {signedContract.archivalRating}
                </p>
              </div>

              {/* Dual Signatures */}
              <div className="grid grid-cols-2 gap-8 items-end pt-2 max-w-md mx-auto">
                <div className="text-center border-t border-line pt-2">
                  <div className="h-12 flex items-center justify-center">
                    <span className="font-serif italic text-lg text-brass font-bold">
                      {signedContract.photographerName}
                    </span>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-mute">
                    Master Photographer
                  </p>
                </div>

                <div className="text-center border-t border-line pt-2">
                  <div className="h-12 flex items-center justify-center">
                    <img
                      src={signedContract.signatureDataUrl}
                      alt="Client signature"
                      className="max-h-10 object-contain"
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-mute">
                    Commissioning Patron
                  </p>
                </div>
              </div>

              {/* Tamper-Proof Cryptographic Hash */}
              <div className="mt-6 pt-4 border-t border-brass/20 text-center">
                <p className="text-[9px] uppercase tracking-widest text-mute font-mono">
                  Tamper-Proof SHA-256 Cryptographic Audit Hash:
                </p>
                <p className="mt-0.5 font-mono text-[9px] text-ink/70 break-all select-all bg-paper/60 p-1 rounded border border-line">
                  {signedContract.sha256Hash}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded flex items-center gap-1.5">
                <span>✓</span> Legally Adopted & Recorded to Vault
              </span>

              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={handlePrintCertificate}>
                  🖨️ Print / Download PDF
                </Button>
                <Button size="sm" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Contract Signing Agreement View */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Sitting Metadata Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded border border-line bg-cream p-4 text-xs font-mono">
              <div>
                <span className="text-mute text-[10px] uppercase">Sitting Reference</span>
                <p className="font-bold text-ink">{sittingId}</p>
              </div>
              <div>
                <span className="text-mute text-[10px] uppercase">Package</span>
                <p className="font-bold text-ink truncate">{packageName}</p>
              </div>
              <div>
                <span className="text-mute text-[10px] uppercase">Lead Photographer</span>
                <p className="font-bold text-ink">{photographerName}</p>
              </div>
            </div>

            {/* Legal Clauses */}
            <div className="rounded border border-line bg-paper p-4 text-xs text-mute max-h-44 overflow-y-auto space-y-3 leading-relaxed">
              <p>
                <strong className="text-ink">1. Fine-Art License & Exclusivity:</strong> The commissioning patron receives an unrestricted, worldwide personal display and private reproduction license for all retouched master deliverables. Master RAW sensor negatives remain secured in Northlight Studio offline deep storage vaults in Ballard Estate.
              </p>
              <p>
                <strong className="text-ink">2. Archival Hahnemühle Longevity Warranty:</strong> All physical prints provided under this sitting are printed with pigmented Lucia PRO mineral inks onto acid-free 308gsm Hahnemühle Photo Rag, certified for a museum archival longevity rating exceeding 100 years.
              </p>
              <p>
                <strong className="text-ink">3. Colorist Direction & Retouching Approval:</strong> Selections confirmed via the Digital Proofing Vault represent final artistic authorization for master skin retouching, color grading, and archival printing.
              </p>
            </div>

            {/* Terms Checkboxes */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAgreedTerms}
                  onChange={(e) => setHasAgreedTerms(e.target.checked)}
                  className="h-4 w-4 accent-brass"
                />
                <span className="text-ink font-medium">
                  I accept the studio fine-art terms, archival guarantees, and delivery schedule.
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAgreedCopyright}
                  onChange={(e) => setHasAgreedCopyright(e.target.checked)}
                  className="h-4 w-4 accent-brass"
                />
                <span className="text-ink font-medium">
                  I authorize generation of a numbered cryptographic Certificate of Authenticity.
                </span>
              </label>
            </div>

            {/* Signer Full Name Input */}
            <div>
              <label className="text-xs uppercase tracking-wider text-mute font-semibold block mb-1">
                Legal Signatory Full Name:
              </label>
              <input
                type="text"
                value={clientSignerName}
                onChange={(e) => setClientSignerName(e.target.value)}
                placeholder="Enter your legal full name"
                className="w-full rounded border border-line bg-cream px-3 py-2 text-sm text-ink focus:outline-none focus:border-ink font-medium"
              />
            </div>

            {/* Signature Drawing Pad */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase tracking-wider text-mute font-semibold">
                  Draw Handwritten Signature:
                </label>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[11px] text-mute hover:text-ink underline uppercase tracking-wider"
                >
                  Clear Signature
                </button>
              </div>

              <div className="relative rounded border-2 border-dashed border-line bg-cream overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={140}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
                  className="w-full h-32 cursor-crosshair touch-none"
                />
                {!hasDrawn && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-mute/50">
                    ✍ Sign with mouse, trackpad, or finger here
                  </div>
                )}
              </div>
            </div>

            {/* Footer Sign Button */}
            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="text-[10px] text-mute uppercase tracking-wider font-mono">
                Cryptographic SHA-256 Audit Sealed
              </span>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAdoptAndSign}
                  disabled={!hasDrawn || !clientSignerName.trim() || !hasAgreedTerms || isSubmitting}
                >
                  {isSubmitting ? 'Sealing Cryptographic Hash...' : 'Adopt Signature & Generate Certificate →'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
