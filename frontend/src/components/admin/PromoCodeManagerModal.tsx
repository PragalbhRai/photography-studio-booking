import { useState } from 'react'
import { type PromoCode, savePromoCode } from '@/lib/promo-codes'
import { Button } from '@/components/ui/Button'

interface PromoCodeManagerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PromoCodeManagerModal({ isOpen, onClose, onSuccess }: PromoCodeManagerModalProps) {
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState<number>(15)
  const [minSpend, setMinSpend] = useState<number>(20000)
  const [maxDiscount, setMaxDiscount] = useState<number>(10000)
  const [usageLimit, setUsageLimit] = useState<number>(50)
  const [applicableCategory, setApplicableCategory] = useState<string>('All')
  const [expiresDays, setExpiresDays] = useState<number>(60)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) {
      setError('Please provide a promo code name.')
      return
    }
    if (discountValue <= 0) {
      setError('Discount value must be greater than zero.')
      return
    }

    const expiryDate = new Date(Date.now() + expiresDays * 86400000).toISOString()

    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: cleanCode,
      description: description || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} off studio reservation`,
      discountType,
      discountValue,
      minSpend: minSpend > 0 ? minSpend : undefined,
      maxDiscount: discountType === 'percentage' && maxDiscount > 0 ? maxDiscount : undefined,
      expiresAt: expiryDate,
      usageCount: 0,
      usageLimit: usageLimit > 0 ? usageLimit : undefined,
      isActive: true,
      applicableCategories: applicableCategory !== 'All' ? [applicableCategory] : undefined,
    }

    savePromoCode(newPromo)
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg border border-line bg-cream p-6 text-ink shadow-2xl md:p-8">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brass">Marketing Engine</p>
            <h2 className="font-display text-2xl">Create VIP Promo Code</h2>
          </div>
          <button onClick={onClose} className="text-mute hover:text-ink">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="text-xs text-red-600 bg-red-50 p-2 border border-red-200">{error}</p>}

          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
              Promo Code String
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. LUXURY2026"
              className="w-full border border-line bg-paper px-3 py-2 font-mono text-sm tracking-widest uppercase focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
              Marketing Campaign Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 20% privilege savings for Summer Editorial sittings"
              className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
                Value {discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
                Minimum Spend (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
                Max Cap {discountType === 'percentage' ? '(₹)' : '(N/A)'}
              </label>
              <input
                type="number"
                min="0"
                step="500"
                disabled={discountType === 'fixed'}
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
                className="w-full border border-line bg-paper px-3 py-2 text-sm disabled:opacity-40 focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
                Category Restriction
              </label>
              <select
                value={applicableCategory}
                onChange={(e) => setApplicableCategory(e.target.value)}
                className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Weddings & Celebrations">Weddings & Celebrations</option>
                <option value="Fashion & Editorial">Fashion & Editorial</option>
                <option value="Portraits & Headshots">Portraits & Headshots</option>
                <option value="Maternity & Newborn">Maternity & Newborn</option>
                <option value="Events & Corporate">Events & Corporate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
                Usage Redemption Limit
              </label>
              <input
                type="number"
                min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.14em] text-mute mb-1">
              Active Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              value={expiresDays}
              onChange={(e) => setExpiresDays(Number(e.target.value))}
              className="w-full border border-line bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Issue Promo Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
