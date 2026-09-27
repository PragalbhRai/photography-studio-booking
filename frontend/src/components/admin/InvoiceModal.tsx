import { useRef } from 'react'
import type { StudioTransaction } from '@/lib/financial-analytics'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/Button'

interface InvoiceModalProps {
  transaction: StudioTransaction | null
  isOpen: boolean
  onClose: () => void
}

export function InvoiceModal({ transaction, isOpen, onClose }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !transaction) return null

  const handlePrint = () => {
    window.print()
  }

  const invoiceDate = new Date(transaction.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-cream p-8 text-ink shadow-2xl md:p-12 print:m-0 print:max-w-none print:p-0 print:shadow-none">
        {/* Action Header - Hidden on Print */}
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs uppercase tracking-[0.2em] text-mute">Settled Fiscal Invoice</span>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="secondary" onClick={handlePrint}>
              🖨️ Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm text-mute transition hover:text-ink"
              aria-label="Close invoice"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div ref={printRef} className="space-y-8 bg-paper/60 p-6 md:p-8">
          {/* Studio Brand Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brass">Haute Studio Atelier</p>
              <h2 className="mt-1 font-display text-3xl tracking-tight">THE HERITAGE ATELIER</h2>
              <p className="mt-1 text-xs text-mute">Fine Art & Commercial Photography Services</p>
              <p className="text-xs text-mute">GSTIN: 07AAACH7409R1ZV · Asia/Kolkata</p>
            </div>
            <div className="text-left md:text-right">
              <span className="inline-block border border-brass/50 bg-brass/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-brass">
                {transaction.invoiceNumber}
              </span>
              <p className="mt-2 text-xs text-mute">
                Issued: <span className="font-medium text-ink">{invoiceDate}</span>
              </p>
              <p className="text-xs text-mute">
                Payment: <span className="font-medium text-ink">{transaction.paymentMethod}</span>
              </p>
            </div>
          </div>

          {/* Billed To / Sitting Details */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brass">Billed Patron</p>
              <p className="mt-1 font-display text-xl">{transaction.clientName}</p>
              <p className="text-sm text-mute">{transaction.clientEmail}</p>
              <p className="mt-2 text-xs text-mute">
                Assigned Master Artist:{' '}
                <span className="font-medium text-ink">{transaction.photographerName}</span>
              </p>
            </div>
            <div className="bg-cream/50 p-4 border border-line">
              <p className="text-[10px] uppercase tracking-[0.2em] text-brass">Session Classification</p>
              <p className="mt-1 text-sm font-medium">{transaction.packageName}</p>
              <p className="text-xs text-mute">Category: {transaction.category}</p>
              <p className="mt-2 text-xs text-emerald-700 font-medium">
                ✓ Settlement Status: {transaction.paymentStatus}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.16em] text-mute">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              <tr>
                <td className="py-3">
                  <p className="font-medium">{transaction.packageName}</p>
                  <p className="text-xs text-mute">Master Sitting, Studio Bay Allocation & Proofing</p>
                </td>
                <td className="py-3 text-right font-mono">{formatPrice(transaction.baseAmount)}</td>
              </tr>
              {transaction.addonsAmount > 0 && (
                <tr>
                  <td className="py-3">
                    <p className="font-medium">Curated Production Add-Ons & Enhancements</p>
                    <p className="text-xs text-mute">Archival film roll / Cinema reel / Drone capture</p>
                  </td>
                  <td className="py-3 text-right font-mono">+{formatPrice(transaction.addonsAmount)}</td>
                </tr>
              )}
              {transaction.discountAmount > 0 && (
                <tr className="text-emerald-700">
                  <td className="py-3">
                    <p className="font-medium">
                      Studio Privilege Courtesy ({transaction.promoCodeApplied || 'PROMO'})
                    </p>
                    <p className="text-xs text-emerald-600">Special promotional rate concession</p>
                  </td>
                  <td className="py-3 text-right font-mono">-{formatPrice(transaction.discountAmount)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Total Calculation */}
          <div className="border-t-2 border-ink pt-4">
            <div className="flex justify-between text-xs text-mute">
              <span>Subtotal</span>
              <span>{formatPrice(transaction.baseAmount + transaction.addonsAmount)}</span>
            </div>
            {transaction.discountAmount > 0 && (
              <div className="mt-1 flex justify-between text-xs text-emerald-700">
                <span>Promotional Concession</span>
                <span>-{formatPrice(transaction.discountAmount)}</span>
              </div>
            )}
            <div className="mt-1 flex justify-between text-xs text-mute">
              <span>Integrated GST (18% inclusive)</span>
              <span>{formatPrice(Math.round(transaction.totalAmount * 0.18))}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3 font-display text-2xl font-bold">
              <span>Total Settled</span>
              <span className="font-mono text-3xl text-brass">{formatPrice(transaction.totalAmount)}</span>
            </div>
          </div>

          {/* Studio Footer Note */}
          <div className="border-t border-line/60 pt-4 text-center text-[10px] text-mute">
            <p>This is a computer-generated tax invoice for luxury studio production services.</p>
            <p className="mt-0.5">Payment verified via {transaction.paymentMethod}. All rights reserved © The Heritage Atelier.</p>
          </div>
        </div>

        {/* Modal Close Button - Hidden on Print */}
        <div className="mt-6 flex justify-end print:hidden">
          <Button variant="secondary" onClick={onClose}>
            Close Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}
