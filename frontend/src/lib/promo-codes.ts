export interface PromoCode {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minSpend?: number
  maxDiscount?: number
  expiresAt: string // ISO string
  usageCount: number
  usageLimit?: number
  isActive: boolean
  applicableCategories?: string[]
}

const STORAGE_KEY = 'studio_promo_codes'

export const DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'ROYAL20',
    description: '20% off Royal Weddings & Luxury Celebrations',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 40000,
    maxDiscount: 15000,
    expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
    usageCount: 14,
    usageLimit: 50,
    isActive: true,
    applicableCategories: ['Weddings & Celebrations'],
  },
  {
    id: 'promo-2',
    code: 'STUDIO5000',
    description: 'Flat ₹5,000 privilege savings for shoots above ₹30,000',
    discountType: 'fixed',
    discountValue: 5000,
    minSpend: 30000,
    expiresAt: new Date(Date.now() + 45 * 86400000).toISOString(),
    usageCount: 22,
    usageLimit: 100,
    isActive: true,
  },
  {
    id: 'promo-3',
    code: 'EDITORIAL15',
    description: '15% savings on Fashion & Haute Couture Editorial bookings',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 25000,
    maxDiscount: 8000,
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    usageCount: 8,
    usageLimit: 25,
    isActive: true,
    applicableCategories: ['Fashion & Editorial'],
  },
  {
    id: 'promo-4',
    code: 'FIRSTLOOK',
    description: '10% welcome courtesy on your inaugural studio sitting',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 15000,
    maxDiscount: 5000,
    expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
    usageCount: 31,
    usageLimit: 200,
    isActive: true,
  },
]

export function getPromoCodes(): PromoCode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROMO_CODES))
      return DEFAULT_PROMO_CODES
    }
    const parsed = JSON.parse(raw) as PromoCode[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROMO_CODES
  } catch {
    return DEFAULT_PROMO_CODES
  }
}

export function savePromoCode(promo: PromoCode): void {
  const current = getPromoCodes()
  const updated = [promo, ...current.filter((p) => p.id !== promo.id)]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function updatePromoCode(id: string, updates: Partial<PromoCode>): void {
  const current = getPromoCodes()
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function deletePromoCode(id: string): void {
  const current = getPromoCodes()
  const updated = current.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function validatePromoCode(
  rawCode: string,
  subtotal: number,
  category?: string,
): { valid: boolean; discount: number; message: string; promo?: PromoCode } {
  const code = rawCode.trim().toUpperCase()
  if (!code) {
    return { valid: false, discount: 0, message: 'Please enter a valid promotional code.' }
  }

  const allPromos = getPromoCodes()
  const promo = allPromos.find((p) => p.code.toUpperCase() === code)

  if (!promo) {
    return { valid: false, discount: 0, message: `Promo code "${code}" is invalid or does not exist.` }
  }

  if (!promo.isActive) {
    return { valid: false, discount: 0, message: `Promo code "${code}" is currently paused.` }
  }

  const now = new Date()
  if (new Date(promo.expiresAt) < now) {
    return { valid: false, discount: 0, message: `Promo code "${code}" expired on ${new Date(promo.expiresAt).toLocaleDateString()}.` }
  }

  if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
    return { valid: false, discount: 0, message: `Promo code "${code}" has reached its maximum redemption limit.` }
  }

  if (promo.minSpend && subtotal < promo.minSpend) {
    return {
      valid: false,
      discount: 0,
      message: `Promo code requires a minimum session booking value of ₹${promo.minSpend.toLocaleString('en-IN')}.`,
    }
  }

  if (promo.applicableCategories && promo.applicableCategories.length > 0 && category) {
    const isCategoryMatched = promo.applicableCategories.some(
      (cat) => cat.toLowerCase() === category.toLowerCase(),
    )
    if (!isCategoryMatched) {
      return {
        valid: false,
        discount: 0,
        message: `Promo code "${code}" is only applicable to ${promo.applicableCategories.join(', ')}.`,
      }
    }
  }

  let calculatedDiscount = 0
  if (promo.discountType === 'percentage') {
    calculatedDiscount = Math.round((subtotal * promo.discountValue) / 100)
    if (promo.maxDiscount && calculatedDiscount > promo.maxDiscount) {
      calculatedDiscount = promo.maxDiscount
    }
  } else {
    calculatedDiscount = promo.discountValue
  }

  if (calculatedDiscount > subtotal) {
    calculatedDiscount = subtotal
  }

  return {
    valid: true,
    discount: calculatedDiscount,
    message: `Promo applied: ${promo.description} (-₹${calculatedDiscount.toLocaleString('en-IN')})`,
    promo,
  }
}

export function recordPromoCodeRedemption(code: string): void {
  const allPromos = getPromoCodes()
  const normalized = code.trim().toUpperCase()
  const updated = allPromos.map((p) => {
    if (p.code.toUpperCase() === normalized) {
      return { ...p, usageCount: p.usageCount + 1 }
    }
    return p
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
