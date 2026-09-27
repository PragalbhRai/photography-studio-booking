import { getLocalBookings } from './mock-data'

export interface StudioTransaction {
  id: string
  bookingId: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  packageName: string
  category: string
  photographerName: string
  baseAmount: number
  addonsAmount: number
  discountAmount: number
  promoCodeApplied?: string
  totalAmount: number
  date: string // ISO string
  paymentMethod: 'Razorpay UPI' | 'Luxury Card (Stripe)' | 'Wire Transfer' | 'Net Banking'
  paymentStatus: 'Settled' | 'Pending' | 'Refunded'
}

export interface MonthlyRevenuePoint {
  month: string // e.g. "Apr 2026"
  shortMonth: string // e.g. "Apr"
  revenue: number
  bookingCount: number
  aov: number
}

export interface CategoryRevenueBreakdown {
  category: string
  revenue: number
  sharePercentage: number
  bookingCount: number
  accentColor: string
}

export interface FinancialSummary {
  totalGrossRevenue: number
  averageOrderValue: number
  addonAttachmentRate: number
  totalBookingsCount: number
  totalDiscountsRedeemed: number
  settledTransactionsCount: number
  pendingReceivables: number
}

const HISTORICAL_TRANSACTIONS: StudioTransaction[] = [
  {
    id: 'tx-101',
    bookingId: 'book-hist-1',
    invoiceNumber: 'INV-2026-0891',
    clientName: 'Maharani Gayatri Singh',
    clientEmail: 'gayatri.singh@heritage.in',
    packageName: 'The Grand Royal Wedding',
    category: 'Weddings & Celebrations',
    photographerName: 'Aarav Sharma',
    baseAmount: 75000,
    addonsAmount: 22000,
    discountAmount: 15000,
    promoCodeApplied: 'ROYAL20',
    totalAmount: 82000,
    date: '2026-09-21T11:30:00Z',
    paymentMethod: 'Wire Transfer',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-102',
    bookingId: 'book-hist-2',
    invoiceNumber: 'INV-2026-0892',
    clientName: 'Devika Singhania',
    clientEmail: 'devika@vogueindia.com',
    packageName: 'Haute Couture Editorial Lookbook',
    category: 'Fashion & Editorial',
    photographerName: 'Rohan Verma',
    baseAmount: 55000,
    addonsAmount: 8000,
    discountAmount: 8000,
    promoCodeApplied: 'EDITORIAL15',
    totalAmount: 55000,
    date: '2026-09-18T14:15:00Z',
    paymentMethod: 'Luxury Card (Stripe)',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-103',
    bookingId: 'book-hist-3',
    invoiceNumber: 'INV-2026-0893',
    clientName: 'Kabir & Tara Malhotra',
    clientEmail: 'kabir.malhotra@gmail.com',
    packageName: 'Heritage Couple Editorial',
    category: 'Weddings & Celebrations',
    photographerName: 'Aarav Sharma',
    baseAmount: 35000,
    addonsAmount: 6000,
    discountAmount: 5000,
    promoCodeApplied: 'STUDIO5000',
    totalAmount: 36000,
    date: '2026-09-14T09:45:00Z',
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-104',
    bookingId: 'book-hist-4',
    invoiceNumber: 'INV-2026-0894',
    clientName: 'Dr. Vikramaditya Roy',
    clientEmail: 'vikram.roy@apexconsulting.com',
    packageName: 'Corporate Summit & Gala Coverage',
    category: 'Events & Corporate',
    photographerName: 'Priya Patel',
    baseAmount: 45000,
    addonsAmount: 12000,
    discountAmount: 0,
    totalAmount: 57000,
    date: '2026-09-08T16:00:00Z',
    paymentMethod: 'Net Banking',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-105',
    bookingId: 'book-hist-5',
    invoiceNumber: 'INV-2026-0895',
    clientName: 'Ananya Mehra',
    clientEmail: 'ananya.mehra@mehraart.com',
    packageName: 'Fine Art Maternity',
    category: 'Maternity & Newborn',
    photographerName: 'Priya Patel',
    baseAmount: 22000,
    addonsAmount: 4000,
    discountAmount: 2200,
    promoCodeApplied: 'FIRSTLOOK',
    totalAmount: 23800,
    date: '2026-09-02T13:20:00Z',
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-106',
    bookingId: 'book-hist-6',
    invoiceNumber: 'INV-2026-0870',
    clientName: 'Samir & Ritu Kapoor',
    clientEmail: 'samir.kapoor@dynasty.co',
    packageName: 'The Grand Royal Wedding',
    category: 'Weddings & Celebrations',
    photographerName: 'Aarav Sharma',
    baseAmount: 75000,
    addonsAmount: 15000,
    discountAmount: 0,
    totalAmount: 90000,
    date: '2026-08-27T10:00:00Z',
    paymentMethod: 'Wire Transfer',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-107',
    bookingId: 'book-hist-7',
    invoiceNumber: 'INV-2026-0871',
    clientName: 'Kunal Deshmukh',
    clientEmail: 'kunal@zenithentertainment.in',
    packageName: 'Designer Campaign Collection',
    category: 'Fashion & Editorial',
    photographerName: 'Rohan Verma',
    baseAmount: 35000,
    addonsAmount: 9000,
    discountAmount: 5000,
    promoCodeApplied: 'STUDIO5000',
    totalAmount: 39000,
    date: '2026-08-20T12:30:00Z',
    paymentMethod: 'Luxury Card (Stripe)',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-108',
    bookingId: 'book-hist-8',
    invoiceNumber: 'INV-2026-0872',
    clientName: 'Alia Sen & Varun Grover',
    clientEmail: 'alia.sen@cinema.org',
    packageName: 'Classic Black & White Portraiture',
    category: 'Portraits & Headshots',
    photographerName: 'Aarav Sharma',
    baseAmount: 15000,
    addonsAmount: 3500,
    discountAmount: 1500,
    promoCodeApplied: 'FIRSTLOOK',
    totalAmount: 17000,
    date: '2026-08-11T15:00:00Z',
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-109',
    bookingId: 'book-hist-9',
    invoiceNumber: 'INV-2026-0850',
    clientName: 'Rajnath Goenka & Family',
    clientEmail: 'goenka.family@capital.in',
    packageName: 'Heritage Family Dynasty Sitting',
    category: 'Portraits & Headshots',
    photographerName: 'Aarav Sharma',
    baseAmount: 28000,
    addonsAmount: 7000,
    discountAmount: 0,
    totalAmount: 35000,
    date: '2026-07-25T11:00:00Z',
    paymentMethod: 'Wire Transfer',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-110',
    bookingId: 'book-hist-10',
    invoiceNumber: 'INV-2026-0851',
    clientName: 'Zara Siddiqui',
    clientEmail: 'zara.s@couture.com',
    packageName: 'Haute Couture Editorial Lookbook',
    category: 'Fashion & Editorial',
    photographerName: 'Rohan Verma',
    baseAmount: 55000,
    addonsAmount: 14000,
    discountAmount: 8250,
    promoCodeApplied: 'EDITORIAL15',
    totalAmount: 60750,
    date: '2026-07-16T14:00:00Z',
    paymentMethod: 'Luxury Card (Stripe)',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-111',
    bookingId: 'book-hist-11',
    invoiceNumber: 'INV-2026-0820',
    clientName: 'Aditya & Neha Chawla',
    clientEmail: 'aditya.chawla@techglobal.io',
    packageName: 'Motherhood & Newborn Story',
    category: 'Maternity & Newborn',
    photographerName: 'Priya Patel',
    baseAmount: 32000,
    addonsAmount: 5000,
    discountAmount: 3200,
    promoCodeApplied: 'FIRSTLOOK',
    totalAmount: 33800,
    date: '2026-06-22T10:30:00Z',
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Settled',
  },
  {
    id: 'tx-112',
    bookingId: 'book-hist-12',
    invoiceNumber: 'INV-2026-0821',
    clientName: 'Sanjay Dutt Khurana',
    clientEmail: 'sanjay@khuranaindustries.com',
    packageName: 'Executive Editorial Headshots',
    category: 'Portraits & Headshots',
    photographerName: 'Rohan Verma',
    baseAmount: 18000,
    addonsAmount: 4000,
    discountAmount: 0,
    totalAmount: 22000,
    date: '2026-06-10T16:45:00Z',
    paymentMethod: 'Net Banking',
    paymentStatus: 'Settled',
  },
]

export function getStudioTransactions(): StudioTransaction[] {
  const localBookings = getLocalBookings()
  const dynamicFromBookings: StudioTransaction[] = localBookings
    .filter((b) => b.status === 'confirmed')
    .map((b, index) => {
      const base = b.price || 35000
      const addonsCount = b.addons ? b.addons.length : 0
      const addonsPrice = addonsCount * 5000
      const discount = b.addons && b.addons.length > 2 ? 3000 : 0
      const total = base + addonsPrice - discount
      const cat = inferCategory(b.package_name || '')
      return {
        id: `tx-dyn-${b.id || index}`,
        bookingId: b.id,
        invoiceNumber: `INV-2026-${(900 + index).toString().padStart(4, '0')}`,
        clientName: b.customer_name || 'Patron Client',
        clientEmail: (b as any).customer_email || 'patron@studio.com',
        packageName: b.package_name || 'Curated Session',
        category: cat,
        photographerName: b.photographer_name || 'Aarav Sharma',
        baseAmount: base,
        addonsAmount: addonsPrice,
        discountAmount: discount,
        promoCodeApplied: discount > 0 ? 'STUDIO5000' : undefined,
        totalAmount: total,
        date: b.created_at || new Date().toISOString(),
        paymentMethod: index % 2 === 0 ? 'Luxury Card (Stripe)' : 'Razorpay UPI',
        paymentStatus: 'Settled',
      }
    })

  // Merge dynamic from bookings with historical, eliminating potential ID collisions
  const combined = [...dynamicFromBookings, ...HISTORICAL_TRANSACTIONS]
  return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function inferCategory(packageName: string): string {
  const p = packageName.toLowerCase()
  if (p.includes('wedding') || p.includes('couple') || p.includes('royal')) return 'Weddings & Celebrations'
  if (p.includes('fashion') || p.includes('couture') || p.includes('designer') || p.includes('campaign'))
    return 'Fashion & Editorial'
  if (p.includes('maternity') || p.includes('newborn') || p.includes('motherhood')) return 'Maternity & Newborn'
  if (p.includes('summit') || p.includes('gala') || p.includes('corporate') || p.includes('event'))
    return 'Events & Corporate'
  return 'Portraits & Headshots'
}

export function getStudioFinancialAnalytics(): {
  summary: FinancialSummary
  transactions: StudioTransaction[]
  monthlyRevenue: MonthlyRevenuePoint[]
  categoryBreakdown: CategoryRevenueBreakdown[]
} {
  const transactions = getStudioTransactions()

  const totalGrossRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0)
  const totalBookingsCount = transactions.length
  const averageOrderValue = totalBookingsCount > 0 ? Math.round(totalGrossRevenue / totalBookingsCount) : 0
  const bookingsWithAddons = transactions.filter((t) => t.addonsAmount > 0).length
  const addonAttachmentRate =
    totalBookingsCount > 0 ? Math.round((bookingsWithAddons / totalBookingsCount) * 100) : 0
  const totalDiscountsRedeemed = transactions.reduce((acc, t) => acc + (t.discountAmount || 0), 0)
  const settledTransactionsCount = transactions.filter((t) => t.paymentStatus === 'Settled').length
  const pendingReceivables = transactions
    .filter((t) => t.paymentStatus === 'Pending')
    .reduce((acc, t) => acc + t.totalAmount, 0)

  const summary: FinancialSummary = {
    totalGrossRevenue,
    averageOrderValue,
    addonAttachmentRate,
    totalBookingsCount,
    totalDiscountsRedeemed,
    settledTransactionsCount,
    pendingReceivables,
  }

  // Group by Month (last 6 months)
  const monthMap: Record<string, { short: string; revenue: number; count: number }> = {
    '2026-04': { short: 'Apr', revenue: 68000, count: 2 },
    '2026-05': { short: 'May', revenue: 78000, count: 2 },
    '2026-06': { short: 'Jun', revenue: 55800, count: 2 },
    '2026-07': { short: 'Jul', revenue: 95750, count: 2 },
    '2026-08': { short: 'Aug', revenue: 146000, count: 3 },
    '2026-09': { short: 'Sep', revenue: 0, count: 0 },
  }

  // Add actual transaction revenues to monthMap
  transactions.forEach((tx) => {
    const yyyymm = tx.date.slice(0, 7)
    if (monthMap[yyyymm]) {
      monthMap[yyyymm].revenue += tx.totalAmount
      monthMap[yyyymm].count += 1
    }
  })

  // Format monthly revenue array
  const monthNames: Record<string, string> = {
    '2026-04': 'Apr 2026',
    '2026-05': 'May 2026',
    '2026-06': 'Jun 2026',
    '2026-07': 'Jul 2026',
    '2026-08': 'Aug 2026',
    '2026-09': 'Sep 2026 (MTD)',
  }

  const monthlyRevenue: MonthlyRevenuePoint[] = Object.keys(monthMap).map((key) => {
    const data = monthMap[key]
    return {
      month: monthNames[key] || key,
      shortMonth: data.short,
      revenue: data.revenue,
      bookingCount: data.count,
      aov: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
    }
  })

  // Category breakdown
  const categoryColors: Record<string, string> = {
    'Weddings & Celebrations': '#b45309', // amber-700 / brass
    'Fashion & Editorial': '#0f766e', // teal-700
    'Portraits & Headshots': '#4338ca', // indigo-700
    'Maternity & Newborn': '#be185d', // pink-700
    'Events & Corporate': '#374151', // gray-700
  }

  const catMap: Record<string, { revenue: number; count: number }> = {}
  transactions.forEach((t) => {
    if (!catMap[t.category]) {
      catMap[t.category] = { revenue: 0, count: 0 }
    }
    catMap[t.category].revenue += t.totalAmount
    catMap[t.category].count += 1
  })

  const categoryBreakdown: CategoryRevenueBreakdown[] = Object.keys(catMap).map((cat) => {
    const rev = catMap[cat].revenue
    const share = totalGrossRevenue > 0 ? Math.round((rev / totalGrossRevenue) * 100) : 0
    return {
      category: cat,
      revenue: rev,
      sharePercentage: share,
      bookingCount: catMap[cat].count,
      accentColor: categoryColors[cat] || '#854d0e',
    }
  })

  categoryBreakdown.sort((a, b) => b.revenue - a.revenue)

  return { summary, transactions, monthlyRevenue, categoryBreakdown }
}

export function exportTransactionsCSV(transactions: StudioTransaction[]): void {
  const headers = [
    'Invoice Number',
    'Date',
    'Client Name',
    'Client Email',
    'Package Name',
    'Category',
    'Photographer',
    'Base Amount (INR)',
    'Addons Amount (INR)',
    'Discount Amount (INR)',
    'Promo Code',
    'Total Paid (INR)',
    'Payment Method',
    'Payment Status',
  ]

  const rows = transactions.map((t) => [
    `"${t.invoiceNumber}"`,
    `"${t.date.split('T')[0]}"`,
    `"${t.clientName.replace(/"/g, '""')}"`,
    `"${t.clientEmail}"`,
    `"${t.packageName.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    `"${t.photographerName.replace(/"/g, '""')}"`,
    t.baseAmount,
    t.addonsAmount,
    t.discountAmount,
    `"${t.promoCodeApplied || 'None'}"`,
    t.totalAmount,
    `"${t.paymentMethod}"`,
    `"${t.paymentStatus}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `Studio_Revenue_Ledger_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
