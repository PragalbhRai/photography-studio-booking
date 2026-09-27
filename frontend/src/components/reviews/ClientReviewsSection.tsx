import { useState } from 'react'
import { CLIENT_REVIEWS, type ClientReview } from '@/lib/reviews'
import { cn } from '@/lib/cn'

interface Props {
  photographerId?: string
  categoryFilter?: string
  title?: string
  subtitle?: string
}

export function ClientReviewsSection({
  photographerId,
  categoryFilter,
  title = 'Client Commendations & Reviews',
  subtitle = 'Reflections from private patrons, couples, and fashion houses who commissioned Northlight Studio.',
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(categoryFilter ?? 'all')

  let reviews = CLIENT_REVIEWS.filter((r) => {
    if (photographerId && r.photographerId !== photographerId) return false
    if (activeCategory !== 'all' && r.category !== activeCategory) return false
    return true
  })

  if (reviews.length === 0) {
    reviews = CLIENT_REVIEWS.slice(0, 3)
  }

  return (
    <section className="mt-20 border-t border-line pt-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex text-brass text-sm tracking-widest">★★★★★</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">
              4.98 / 5.0 · 84 Verified Sittings
            </span>
          </div>
          <h2 className="mt-2 font-display text-4xl text-ink">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-mute leading-relaxed">{subtitle}</p>
        </div>

        {/* Filter categories if not forced by parent */}
        {!categoryFilter && !photographerId ? (
          <div className="flex flex-wrap gap-1.5 border border-line bg-cream p-1 rounded">
            {[
              { id: 'all', label: 'All Reviews' },
              { id: 'Weddings & Celebrations', label: 'Weddings' },
              { id: 'Portraits & Headshots', label: 'Portraits' },
              { id: 'Fashion & Editorial', label: 'Fashion & Editorial' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
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
        ) : null}
      </div>

      {/* Reviews Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((rev: ClientReview) => (
          <div
            key={rev.id}
            className="flex flex-col justify-between rounded border border-line bg-paper p-6 transition hover:border-ink/40 hover:bg-cream"
          >
            <div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-brass text-xs tracking-wider">★★★★★</span>
                <span className="rounded bg-brass/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-brass font-semibold">
                  {rev.highlightTag}
                </span>
              </div>

              <h4 className="mt-4 font-display text-lg font-semibold text-ink leading-snug">
                “{rev.title}”
              </h4>
              <p className="mt-2.5 text-xs text-mute leading-relaxed">
                {rev.comment}
              </p>
            </div>

            <div className="mt-6 border-t border-line/60 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink">{rev.clientName}</p>
                  <p className="text-[10px] text-mute">{rev.clientLocation}</p>
                </div>
                {rev.verified ? (
                  <span className="flex items-center gap-1 rounded bg-cream border border-line px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                    <span>✓</span> Verified Client
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-[10px] text-mute/80 uppercase tracking-wider">
                Photographed by <strong className="text-ink font-medium">{rev.photographerName}</strong> · {rev.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
