import { useState } from 'react'
import { saveReview, type ClientReview } from '@/lib/reviews'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

interface Props {
  isOpen: boolean
  onClose: () => void
  photographerId: string
  photographerName: string
  packageName?: string
  packageId?: string
  onReviewSubmitted?: (review: ClientReview) => void
}

const HIGHLIGHT_TAGS = [
  'Royal Heritage Masterpiece',
  'Flawless Studio Direction',
  '48h Priority Delivery',
  'Stunning Lighting & Color',
  'Warm & Patient on Set',
  'Magazine Worthy',
]

export function LeaveReviewModal({
  isOpen,
  onClose,
  photographerId,
  photographerName,
  packageName = 'Studio Commission',
  packageId = 'pkg-1',
  onReviewSubmitted,
}: Props) {
  const { user } = useAuth()
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [highlightTag, setHighlightTag] = useState(HIGHLIGHT_TAGS[0])
  const [location, setLocation] = useState('Mumbai, India')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !comment.trim()) return

    const newRev: ClientReview = {
      id: 'rev-user-' + Date.now(),
      clientName: user?.full_name || 'Verified Client',
      clientLocation: location.trim() || 'Mumbai, India',
      rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      packageName,
      packageId,
      photographerName,
      photographerId,
      category: 'Weddings & Celebrations',
      title: title.trim(),
      comment: comment.trim(),
      verified: true,
      highlightTag,
    }

    saveReview(newRev)
    setSubmitted(true)
    setTimeout(() => {
      onReviewSubmitted?.(newRev)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded border border-brass/50 bg-paper p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full text-mute hover:bg-cream hover:text-ink transition text-sm"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-10 text-center">
            <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-2xl">
              ✓
            </span>
            <h3 className="mt-4 font-display text-2xl text-ink">Review Published</h3>
            <p className="mt-2 text-xs text-mute">
              Your verified commendation for {photographerName} is now live with your verified client badge.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-brass font-medium">
                Client Commendation
              </p>
              <h3 className="mt-1 font-display text-2xl text-ink">
                Review {photographerName}
              </h3>
              <p className="mt-1 text-xs text-mute">
                Session: <strong className="text-ink font-medium">{packageName}</strong>
              </p>
            </div>

            {/* Star Rating Picker */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                Your Rating
              </label>
              <div className="mt-2 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition hover:scale-110"
                  >
                    <span
                      className={
                        (hoverRating || rating) >= star ? 'text-brass' : 'text-line'
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-xs font-medium text-mute">
                  {rating === 5 ? '5.0 · Exceptional Masterclass' : `${rating}.0 Stars`}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                Review Headline
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unbelievable eye for detail and patient with our family"
                className="mt-1.5 w-full rounded border border-line bg-cream px-3 py-2 text-xs text-ink placeholder:text-mute/60 focus:border-ink focus:outline-none"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                Your Experience & Feedback
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the lighting, coaching, professionalism, or deliverable quality…"
                className="mt-1.5 w-full rounded border border-line bg-cream p-3 text-xs text-ink placeholder:text-mute/60 focus:border-ink focus:outline-none"
              />
            </div>

            {/* Highlight Tag */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                Praise Tag
              </label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {HIGHLIGHT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setHighlightTag(tag)}
                    className={cn(
                      'rounded px-2.5 py-1 text-[10px] uppercase tracking-wider transition border',
                      highlightTag === tag
                        ? 'border-brass bg-brass text-cream font-semibold'
                        : 'border-line bg-cream text-mute hover:border-ink/40',
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block">
                Your City / Country
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, India or London, UK"
                className="mt-1.5 w-full rounded border border-line bg-cream px-3 py-2 text-xs text-ink placeholder:text-mute/60 focus:border-ink focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
              <Button variant="secondary" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={!title.trim() || !comment.trim()}>
                Submit Verified Review →
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
