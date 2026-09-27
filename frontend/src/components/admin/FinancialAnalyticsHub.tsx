import { useState, useMemo } from 'react'
import {
  getStudioFinancialAnalytics,
  exportTransactionsCSV,
  type StudioTransaction,
} from '@/lib/financial-analytics'
import {
  getPromoCodes,
  updatePromoCode,
  deletePromoCode,
  type PromoCode,
} from '@/lib/promo-codes'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { InvoiceModal } from './InvoiceModal'
import { PromoCodeManagerModal } from './PromoCodeManagerModal'

export function FinancialAnalyticsHub() {
  const [promoVersion, setPromoVersion] = useState(0)
  const [selectedInvoice, setSelectedInvoice] = useState<StudioTransaction | null>(null)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isCreatePromoOpen, setIsCreatePromoOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Filters for Transactions Ledger
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'analytics' | 'promos' | 'ledger'>('analytics')

  // Load analytics & promo codes
  const { summary, transactions, monthlyRevenue, categoryBreakdown } = useMemo(() => {
    return getStudioFinancialAnalytics()
  }, [])

  const promoCodes = useMemo(() => {
    return getPromoCodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoVersion])

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.photographerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.packageName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCat = categoryFilter === 'All' || tx.category === categoryFilter
      const matchesStatus = statusFilter === 'All' || tx.paymentStatus === statusFilter

      return matchesSearch && matchesCat && matchesStatus
    })
  }, [transactions, searchQuery, categoryFilter, statusFilter])

  const handleTogglePromo = (promo: PromoCode) => {
    updatePromoCode(promo.id, { isActive: !promo.isActive })
    setPromoVersion((v) => v + 1)
  }

  const handleDeletePromo = (id: string) => {
    if (confirm('Are you sure you want to retire this promotional privilege code?')) {
      deletePromoCode(id)
      setPromoVersion((v) => v + 1)
    }
  }

  const handleCopyCode = (code: string) => {
    void navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Max revenue for scaling bar chart
  const maxMonthRev = Math.max(...monthlyRevenue.map((m) => m.revenue), 1)

  return (
    <div className="space-y-10">
      {/* Top Controls & Navigation Sub-Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
              activeTab === 'analytics'
                ? 'border-ink bg-ink text-cream'
                : 'border-line text-mute hover:text-ink'
            }`}
          >
            📊 Revenue Trajectory & Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('promos')}
            className={`border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
              activeTab === 'promos'
                ? 'border-ink bg-ink text-cream'
                : 'border-line text-mute hover:text-ink'
            }`}
          >
            🎟️ Promo Engine ({promoCodes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
              activeTab === 'ledger'
                ? 'border-ink bg-ink text-cream'
                : 'border-line text-mute hover:text-ink'
            }`}
          >
            📑 Audit Ledger ({transactions.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => exportTransactionsCSV(filteredTransactions)}
          >
            📥 Export CSV Ledger
          </Button>
          <Button size="sm" onClick={() => setIsCreatePromoOpen(true)}>
            ➕ Issue VIP Promo
          </Button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Gross Studio Earnings</p>
            <span className="inline-block bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
              +28.4% YoY
            </span>
          </div>
          <p className="mt-2 font-display text-4xl text-ink">
            {formatPrice(summary.totalGrossRevenue)}
          </p>
          <p className="mt-1 text-xs text-mute">
            Across {summary.totalBookingsCount} authenticated commercial sessions
          </p>
        </div>

        <div className="border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Average Order Value (AOV)</p>
            <span className="text-[10px] uppercase tracking-wider text-brass">Target: ₹35,000</span>
          </div>
          <p className="mt-2 font-display text-4xl text-ink">
            {formatPrice(summary.averageOrderValue)}
          </p>
          <p className="mt-1 text-xs text-mute">Per confirmed reservation & master sitting</p>
        </div>

        <div className="border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Add-on Attachment Rate</p>
            <span className="inline-block bg-brass/15 px-2 py-0.5 text-[10px] font-semibold text-brass">
              High Margin
            </span>
          </div>
          <p className="mt-2 font-display text-4xl text-ink">{summary.addonAttachmentRate}%</p>
          <p className="mt-1 text-xs text-mute">Opted for Archival Film, Drone, or Cinema</p>
        </div>

        <div className="border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Client Promo Privilege</p>
            <span className="inline-block bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Marketing ROI
            </span>
          </div>
          <p className="mt-2 font-display text-4xl text-ink">
            {formatPrice(summary.totalDiscountsRedeemed)}
          </p>
          <p className="mt-1 text-xs text-mute">Total savings passed to VIP clients</p>
        </div>
      </div>

      {/* VIEW 1: REVENUE TRAJECTORY & CATEGORIES */}
      {activeTab === 'analytics' && (
        <div className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Monthly Bar Chart */}
            <div className="border border-line bg-cream p-6 lg:col-span-7">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brass">Temporal Trends</p>
                  <h3 className="font-display text-2xl">Monthly Revenue Trajectory</h3>
                </div>
                <span className="text-xs text-mute">Trailing 6 Months</span>
              </div>

              {/* Chart Visual */}
              <div className="mt-8 flex h-64 items-end justify-between gap-2 border-b border-line px-2 pb-2">
                {monthlyRevenue.map((pt) => {
                  const heightPercent = Math.max(Math.round((pt.revenue / maxMonthRev) * 100), 10)
                  return (
                    <div key={pt.shortMonth} className="group relative flex flex-1 flex-col items-center">
                      {/* Tooltip Hover Bubble */}
                      <div className="pointer-events-none absolute -top-16 z-20 hidden flex-col items-center rounded bg-ink px-2.5 py-1 text-cream shadow-xl group-hover:flex">
                        <span className="font-mono text-xs font-semibold">{formatPrice(pt.revenue)}</span>
                        <span className="text-[9px] text-paper/80">
                          {pt.bookingCount} shoots · AOV {formatPrice(pt.aov)}
                        </span>
                        <div className="h-1.5 w-1.5 rotate-45 bg-ink -mb-1"></div>
                      </div>

                      {/* Bar Graphic */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[42px] rounded-t bg-ink/80 transition-all duration-300 group-hover:bg-brass"
                      ></div>

                      {/* Month Label */}
                      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-mute group-hover:text-ink">
                        {pt.shortMonth}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-mute">
                <span>Lowest: {formatPrice(Math.min(...monthlyRevenue.map((m) => m.revenue)))}</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brass"></span> Peak Trajectory (Festive Season)
                </span>
                <span>Peak: {formatPrice(maxMonthRev)}</span>
              </div>
            </div>

            {/* Category Revenue Breakdown */}
            <div className="border border-line bg-cream p-6 lg:col-span-5">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brass">Portfolio Mix</p>
                  <h3 className="font-display text-2xl">Revenue by Category</h3>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {categoryBreakdown.map((item) => (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink">{item.category}</span>
                      <span className="font-mono font-medium text-ink">
                        {formatPrice(item.revenue)} ({item.sharePercentage}%)
                      </span>
                    </div>
                    {/* Progress Bar Meter */}
                    <div className="h-2 w-full overflow-hidden bg-line/50">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${item.sharePercentage}%`,
                          backgroundColor: item.accentColor,
                        }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-mute">{item.bookingCount} authenticated sessions</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Rails & Financial Integrity */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-line bg-cream p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mute">Settlement Rails</p>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Luxury Card (Stripe)</span>
                  <span className="font-mono font-medium">48%</span>
                </div>
                <div className="flex justify-between">
                  <span>Razorpay Instant UPI</span>
                  <span className="font-mono font-medium">32%</span>
                </div>
                <div className="flex justify-between">
                  <span>Direct Studio Wire</span>
                  <span className="font-mono font-medium">20%</span>
                </div>
              </div>
            </div>

            <div className="border border-line bg-cream p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mute">GST & Fiscal Compliance</p>
              <p className="mt-2 font-display text-2xl">100% Tax Compliant</p>
              <p className="mt-1 text-xs text-mute">
                Automated 18% Integrated GST itemization on all verified patron receipts.
              </p>
            </div>

            <div className="border border-line bg-cream p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mute">Accounting Quick Action</p>
              <p className="mt-2 font-display text-2xl">Ledger Export</p>
              <p className="mt-1 text-xs text-mute">Download complete fiscal audit trail in CSV format.</p>
              <button
                onClick={() => exportTransactionsCSV(transactions)}
                className="mt-3 text-xs uppercase tracking-[0.16em] text-brass underline hover:text-ink"
              >
                Download Ledger CSV →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PROMO CODES ENGINE */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-3xl">Active Promotional Privileges</h3>
              <p className="mt-1 text-sm text-mute">
                Manage promotional discount codes applicable during client booking and checkout.
              </p>
            </div>
            <Button size="sm" onClick={() => setIsCreatePromoOpen(true)}>
              ➕ Issue New Promo
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promoCodes.map((promo) => {
              const isExpired = new Date(promo.expiresAt) < new Date()
              const isExhausted = Boolean(promo.usageLimit && promo.usageCount >= promo.usageLimit)

              return (
                <div
                  key={promo.id}
                  className={`relative flex flex-col justify-between border bg-cream p-6 transition ${
                    !promo.isActive || isExpired || isExhausted
                      ? 'border-line/60 opacity-60'
                      : 'border-line shadow-sm hover:border-brass'
                  }`}
                >
                  <div>
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          !promo.isActive
                            ? 'bg-zinc-200 text-zinc-700'
                            : isExpired
                            ? 'bg-red-100 text-red-700'
                            : isExhausted
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {!promo.isActive
                          ? 'PAUSED'
                          : isExpired
                          ? 'EXPIRED'
                          : isExhausted
                          ? 'EXHAUSTED'
                          : 'ACTIVE'}
                      </span>
                      <span className="text-[11px] text-mute">
                        Expires {new Date(promo.expiresAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Promo String & Copy */}
                    <div className="mt-4 flex items-center justify-between border border-dashed border-line bg-paper p-3">
                      <span className="font-mono text-lg font-bold tracking-widest text-ink">
                        {promo.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(promo.code)}
                        className="text-xs text-brass hover:underline"
                      >
                        {copiedCode === promo.code ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <p className="mt-3 text-sm font-medium">{promo.description}</p>

                    <div className="mt-3 space-y-1 text-xs text-mute">
                      <p>
                        Benefit:{' '}
                        <span className="font-medium text-ink">
                          {promo.discountType === 'percentage'
                            ? `${promo.discountValue}% discount`
                            : `₹${promo.discountValue.toLocaleString('en-IN')} off`}
                        </span>
                      </p>
                      {promo.minSpend && (
                        <p>
                          Minimum Spend:{' '}
                          <span className="font-medium text-ink">
                            ₹{promo.minSpend.toLocaleString('en-IN')}
                          </span>
                        </p>
                      )}
                      {promo.applicableCategories && (
                        <p>
                          Category:{' '}
                          <span className="font-medium text-ink">
                            {promo.applicableCategories.join(', ')}
                          </span>
                        </p>
                      )}
                      <p>
                        Redemptions:{' '}
                        <span className="font-medium text-ink">
                          {promo.usageCount} {promo.usageLimit ? `/ ${promo.usageLimit}` : 'times'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                    <button
                      onClick={() => handleTogglePromo(promo)}
                      className="text-xs uppercase tracking-wider text-mute hover:text-ink"
                    >
                      {promo.isActive ? '⏸ Pause' : '▶ Activate'}
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="text-xs uppercase tracking-wider text-red-700 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: AUDIT TRANSACTIONS LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-3xl">Fiscal Transactions Ledger</h3>
              <p className="mt-1 text-sm text-mute">
                Itemized records of all commercial sittings, payments, and privilege concessions.
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => exportTransactionsCSV(filteredTransactions)}
            >
              📥 Export Filtered ({filteredTransactions.length}) to CSV
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Search patron, invoice #, package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-line bg-cream px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-line bg-cream px-3 py-2 text-sm focus:border-ink focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Weddings & Celebrations">Weddings & Celebrations</option>
              <option value="Fashion & Editorial">Fashion & Editorial</option>
              <option value="Portraits & Headshots">Portraits & Headshots</option>
              <option value="Maternity & Newborn">Maternity & Newborn</option>
              <option value="Events & Corporate">Events & Corporate</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-line bg-cream px-3 py-2 text-sm focus:border-ink focus:outline-none"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Settled">Settled</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-line bg-cream">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-paper/60 uppercase tracking-[0.14em] text-mute">
                <tr>
                  <th className="px-4 py-3 font-medium">Invoice #</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Billed Patron</th>
                  <th className="px-4 py-3 font-medium">Session & Artist</th>
                  <th className="px-4 py-3 font-medium text-right">Base</th>
                  <th className="px-4 py-3 font-medium text-right">Addons</th>
                  <th className="px-4 py-3 font-medium text-right">Disc</th>
                  <th className="px-4 py-3 font-medium text-right">Net Settled</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="transition hover:bg-paper/40">
                    <td className="px-4 py-3 font-mono font-medium text-brass">
                      {tx.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-mute">
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{tx.clientName}</p>
                      <p className="text-[10px] text-mute">{tx.clientEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{tx.packageName}</p>
                      <p className="text-[10px] text-mute">Artist: {tx.photographerName}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-mute">
                      {formatPrice(tx.baseAmount)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-mute">
                      {tx.addonsAmount > 0 ? `+${formatPrice(tx.addonsAmount)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700">
                      {tx.discountAmount > 0 ? `-${formatPrice(tx.discountAmount)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-ink">
                      {formatPrice(tx.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">
                        {tx.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedInvoice(tx)
                          setIsInvoiceOpen(true)
                        }}
                        className="border border-line bg-paper px-2.5 py-1 text-[11px] font-medium transition hover:border-ink"
                      >
                        📄 Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      <InvoiceModal
        transaction={selectedInvoice}
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false)
          setSelectedInvoice(null)
        }}
      />

      {/* Create Promo Code Modal */}
      <PromoCodeManagerModal
        isOpen={isCreatePromoOpen}
        onClose={() => setIsCreatePromoOpen(false)}
        onSuccess={() => setPromoVersion((v) => v + 1)}
      />
    </div>
  )
}
