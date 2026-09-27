import { Button } from '@/components/ui/Button'
import type { SignedContract } from '@/lib/contracts'

interface Props {
  isOpen: boolean
  onClose: () => void
  contract: SignedContract | null
}

export function CertificateOfAuthenticityModal({ isOpen, onClose, contract }: Props) {
  if (!isOpen || !contract) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded border border-brass/40 bg-paper shadow-2xl overflow-hidden my-6 flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-line bg-cream px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
            <h3 className="font-display text-base text-ink font-semibold">
              Official Archival Provenance & Certificate
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handlePrint}>
              🖨️ Print / Save PDF
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-mute hover:text-ink text-sm border border-line"
            >
              ✕
            </button>
          </div>
        </div>

        {/* The Museum Certificate Parchment */}
        <div className="p-6 sm:p-10 bg-[#FAF7F0] overflow-y-auto">
          <div className="relative rounded-sm border-4 border-double border-brass/80 bg-[#FFFDF9] p-8 sm:p-12 shadow-md text-center overflow-hidden">
            {/* Corner Gilded Accents */}
            <div className="absolute top-3 left-3 text-brass/50 font-serif text-2xl select-none">✦</div>
            <div className="absolute top-3 right-3 text-brass/50 font-serif text-2xl select-none">✦</div>
            <div className="absolute bottom-3 left-3 text-brass/50 font-serif text-2xl select-none">✦</div>
            <div className="absolute bottom-3 right-3 text-brass/50 font-serif text-2xl select-none">✦</div>

            {/* Inner Thin Border */}
            <div className="pointer-events-none absolute inset-2.5 border border-brass/25 rounded-sm" />

            {/* Studio Seal Crest */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-brass bg-cream/60 shadow-sm">
              <span className="font-display text-3xl text-brass font-bold tracking-wider">NL</span>
            </div>

            <p className="mt-4 text-[10px] uppercase tracking-[0.32em] text-brass font-bold">
              Northlight Studio · Ballard Estate, Mumbai
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl text-ink font-semibold">
              Certificate of Archival Authenticity
            </h1>
            <p className="mt-1 font-mono text-xs text-brass font-bold tracking-wider">
              {contract.certificateNumber}
            </p>

            {/* Description Narrative */}
            <div className="my-6 border-t border-b border-brass/30 py-5 text-xs text-mute max-w-lg mx-auto space-y-2.5 leading-relaxed">
              <p>
                This document certifies that the fine-art photographic commission entitled{' '}
                <strong className="text-ink font-semibold">{contract.packageName}</strong> (Reference:{' '}
                <span className="font-mono text-ink font-medium">{contract.sittingId}</span>), commissioned by{' '}
                <strong className="text-ink font-semibold">{contract.clientName}</strong> and created under the artistic direction of Master Photographer{' '}
                <strong className="text-ink font-semibold">{contract.photographerName}</strong>, is recorded in the studio permanent registry as an authenticated Northlight masterwork.
              </p>
              <div className="pt-2 text-[11px] font-mono text-ink/80 space-y-0.5">
                <p><strong>Substrate:</strong> {contract.paperStock}</p>
                <p><strong>Permanence Rating:</strong> {contract.archivalRating}</p>
                <p><strong>Date of Authentication:</strong> {new Date(contract.signedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Dual Signatures */}
            <div className="grid grid-cols-2 gap-8 items-end pt-4 max-w-md mx-auto">
              <div className="text-center border-t border-brass/40 pt-2.5">
                <div className="h-14 flex items-center justify-center">
                  <span className="font-serif italic text-xl text-brass font-bold">
                    {contract.photographerName}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-mute font-semibold">
                  Master Photographer
                </p>
                <p className="text-[9px] text-mute/80 font-mono">Northlight Studio</p>
              </div>

              <div className="text-center border-t border-brass/40 pt-2.5">
                <div className="h-14 flex items-center justify-center">
                  {contract.signatureDataUrl.startsWith('data:image') ? (
                    <img
                      src={contract.signatureDataUrl}
                      alt="Patron signature"
                      className="max-h-12 object-contain"
                    />
                  ) : (
                    <span className="font-serif italic text-lg text-ink font-bold">
                      {contract.clientName}
                    </span>
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-mute font-semibold">
                  Commissioning Patron
                </p>
                <p className="text-[9px] text-mute/80 font-mono">{contract.clientName}</p>
              </div>
            </div>

            {/* Tamper-Proof SHA-256 Audit Seal */}
            <div className="mt-8 pt-4 border-t border-brass/25 text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brass/10 px-3 py-1 border border-brass/30 text-[9px] uppercase tracking-wider font-mono text-brass font-semibold mb-2">
                <span>✓</span> Tamper-Proof Cryptographic Provenance
              </div>
              <p className="text-[9px] uppercase tracking-widest text-mute font-mono">
                SHA-256 Digital Fingerprint:
              </p>
              <p className="mt-1 font-mono text-[9px] text-ink/80 select-all bg-cream px-3 py-1.5 rounded border border-line break-all max-w-lg mx-auto">
                {contract.sha256Hash}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="border-t border-line bg-cream px-6 py-3.5 flex items-center justify-between print:hidden">
          <span className="text-[11px] font-mono text-mute">
            Archival Registry · Ballard Estate Master Vault
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handlePrint}>
              🖨️ Print Certificate
            </Button>
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
