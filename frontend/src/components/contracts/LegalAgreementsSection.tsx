import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { getStoredContracts, type SignedContract } from '@/lib/contracts'
import { LegalSignatureModal } from './LegalSignatureModal'
import { CertificateOfAuthenticityModal } from './CertificateOfAuthenticityModal'

interface Props {
  userName?: string
}

export function LegalAgreementsSection({ userName = 'Patron' }: Props) {
  const [contracts, setContracts] = useState<SignedContract[]>([])
  const [isSigningOpen, setIsSigningOpen] = useState(false)
  const [isCertificateOpen, setIsCertificateOpen] = useState(false)
  const [activeCertificate, setActiveCertificate] = useState<SignedContract | null>(null)

  useEffect(() => {
    const list = getStoredContracts()
    if (list.length === 0) {
      // Seed a default signed contract for instant demo
      const seed: SignedContract = {
        id: 'contract-demo-1',
        sittingId: 'NL-2026-081',
        clientName: userName || 'Pooja & Karan Malhotra',
        packageName: 'Royal Palace Wedding Masterwork',
        photographerName: 'Aarav Sharma',
        signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><path d="M10 25 Q 40 5, 80 20 T 150 25" fill="none" stroke="%23C5A059" stroke-width="2.5"/></svg>',
        signedAt: '2026-09-20T14:30:00.000Z',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        certificateNumber: 'NL-CERT-849102',
        archivalRating: 'ISO 9706 Certified · 100+ Years Museum Life',
        paperStock: 'Hahnemühle Photo Rag 308gsm 100% Cotton Rag',
      }
      setContracts([seed])
    } else {
      setContracts(list)
    }
  }, [userName])

  const refreshContracts = () => {
    setContracts(getStoredContracts())
  }

  return (
    <div className="mt-16 rounded border border-line bg-paper p-6 sm:p-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-brass animate-pulse" />
            <p className="text-[11px] uppercase tracking-[0.24em] text-brass font-medium">
              Legal Compliance & Provenance
            </p>
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
            Sitting Agreements & Authenticity Certificates
          </h2>
          <p className="mt-2 max-w-xl text-sm text-mute">
            Review your signed photographic commission contracts, archival Hahnemühle print warranties, and tamper-proof cryptographic certificates of authenticity.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsSigningOpen(true)}>
          ✍ Sign New Sitting Agreement
        </Button>
      </div>

      {/* Contracts List */}
      <div className="mt-8 space-y-4">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="flex flex-col md:flex-row md:items-center justify-between rounded border border-line bg-cream p-5 gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-brass/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brass font-bold border border-brass/20">
                  {c.certificateNumber}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  ✓ SHA-256 Audit Sealed
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl text-ink font-semibold">
                {c.packageName}
              </h3>
              <p className="mt-1 text-xs text-mute font-mono">
                Commissioned by: <span className="text-ink font-medium">{c.clientName}</span> · Master Artist:{' '}
                <span className="text-ink font-medium">{c.photographerName}</span>
              </p>
              <p className="mt-1 text-[11px] text-mute font-mono">
                Substrate: {c.paperStock} · {c.archivalRating}
              </p>
              <div className="mt-2 text-[10px] text-mute/80 font-mono flex items-center gap-2">
                <span>Hash:</span>
                <span className="truncate max-w-[280px] bg-paper px-1.5 py-0.5 rounded border border-line">
                  {c.sha256Hash}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setActiveCertificate(c)
                  setIsCertificateOpen(true)
                }}
              >
                📜 View Certificate of Authenticity
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dedicated Museum Certificate of Authenticity Modal */}
      <CertificateOfAuthenticityModal
        isOpen={isCertificateOpen}
        onClose={() => {
          setIsCertificateOpen(false)
          setActiveCertificate(null)
        }}
        contract={activeCertificate}
      />

      {/* Signing & Contract Agreement Modal */}
      <LegalSignatureModal
        isOpen={isSigningOpen}
        onClose={() => {
          setIsSigningOpen(false)
          refreshContracts()
        }}
        sittingId="NL-SIT-2026-088"
        clientName={userName || 'Pooja Malhotra'}
        packageName="Royal Palace Wedding Masterwork"
        photographerName="Aarav Sharma"
        onSigned={(newContract) => {
          refreshContracts()
          setIsSigningOpen(false)
          setActiveCertificate(newContract)
          setIsCertificateOpen(true)
        }}
      />
    </div>
  )
}
