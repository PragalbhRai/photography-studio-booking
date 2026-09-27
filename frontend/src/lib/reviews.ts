export interface ClientReview {
  id: string
  clientName: string
  clientLocation: string
  rating: number
  date: string
  packageName: string
  packageId: string
  photographerName: string
  photographerId: string
  category: 'Weddings & Celebrations' | 'Portraits & Headshots' | 'Fashion & Editorial'
  title: string
  comment: string
  verified: boolean
  highlightTag: string
}

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    clientName: 'Priyanka & Devraj Singhania',
    clientLocation: 'Mumbai & London',
    rating: 5,
    date: 'August 2026',
    packageName: 'Royal Heritage Wedding Ceremony',
    packageId: 'pkg-1',
    photographerName: 'Aarav Sharma',
    photographerId: 'photo-1',
    category: 'Weddings & Celebrations',
    title: 'The Hasselblad medium format detail left our entire family breathless.',
    comment:
      'We booked Aarav for our Udaipur palace ceremony. The sheer clarity of the silk zardozi and our evening candlelight portraits looked like an international Vogue cover. The client portal countdown and concierge drone team were completely seamless.',
    verified: true,
    highlightTag: 'Royal Heritage Masterpiece',
  },
  {
    id: 'rev-2',
    clientName: 'Rohit Kulkarni',
    clientLocation: 'Bandra, Mumbai',
    rating: 5,
    date: 'September 2026',
    packageName: 'Executive Editorial Headshot',
    packageId: 'pkg-2',
    photographerName: 'Meera Joshi',
    photographerId: 'photo-2',
    category: 'Portraits & Headshots',
    title: 'Transformed my public brand profile within 48 hours.',
    comment:
      'Meera has an innate eye for architectural lighting and micro-expressions. I opted for the 48-Hour Priority Express Vault and received my retouched selects well ahead of my keynote presentation in Singapore. Outstanding studio experience.',
    verified: true,
    highlightTag: '48h Priority Delivery',
  },
  {
    id: 'rev-3',
    clientName: 'Ananya Deshmukh',
    clientLocation: 'Colaba, Mumbai',
    rating: 5,
    date: 'July 2026',
    packageName: 'Heritage Stepwell Fashion Editorial',
    packageId: 'pkg-3',
    photographerName: 'Kabir Mehta',
    photographerId: 'photo-3',
    category: 'Fashion & Editorial',
    title: 'The cinematic teaser reel and anamorphic lighting blew us away.',
    comment:
      'Kabir and his 3-artist cinema crew brought our luxury couture collection to life. The color grading on the raw sensor log footage was pure cinema. The proofing gallery allowed our creative director to heart and comment on hero frames with ease.',
    verified: true,
    highlightTag: 'Cinematic Anamorphic Grade',
  },
  {
    id: 'rev-4',
    clientName: 'Dr. Siddharth & Rhea Kapoor',
    clientLocation: 'Pune, India',
    rating: 5,
    date: 'June 2026',
    packageName: 'Couples Golden Hour Portrait',
    packageId: 'pkg-4',
    photographerName: 'Aarav Sharma',
    photographerId: 'photo-1',
    category: 'Weddings & Celebrations',
    title: 'The Golden Hour lighting indicator in the booking system was 100% accurate.',
    comment:
      'We reserved the 04:30 PM slot specifically because the booking system flagged it as Golden Hour. The natural sunset halo around Ballard Estate was mesmerizing. The handcrafted Italian leather album arrived beautifully packaged in a bespoke linen box.',
    verified: true,
    highlightTag: 'Golden Hour Sunset Magic',
  },
  {
    id: 'rev-5',
    clientName: 'Natasha Fernandez',
    clientLocation: 'Dubai, UAE',
    rating: 5,
    date: 'September 2026',
    packageName: 'Fine-Art Monochrome Noir',
    packageId: 'pkg-5',
    photographerName: 'Meera Joshi',
    photographerId: 'photo-2',
    category: 'Portraits & Headshots',
    title: 'Tonal black & white prints that deserve an art gallery exhibition.',
    comment:
      'The studio space in Fort has an old-world European charm with modern Profoto strobes. Meera coached me through poses with calm authority. The final silver halide monochrome proofs were utterly timeless.',
    verified: true,
    highlightTag: 'Fine Art Tonal Depth',
  },
  {
    id: 'rev-6',
    clientName: 'Vikramaditya Roy',
    clientLocation: 'New Delhi',
    rating: 5,
    date: 'May 2026',
    packageName: 'Pre-Wedding Royal Palace Commission',
    packageId: 'pkg-1',
    photographerName: 'Aarav Sharma',
    photographerId: 'photo-1',
    category: 'Weddings & Celebrations',
    title: 'Unmatched professionalism from initial prep call to master gallery delivery.',
    comment:
      'The studio call sheet and wardrobe styling guide provided in our dashboard eliminated every ounce of shoot-day stress. Aarav captured moments of genuine intimacy amidst the grandeur of the palace courtyards.',
    verified: true,
    highlightTag: 'Flawless Studio Direction',
  },
]

const REVIEWS_STORAGE_KEY = 'northlight_client_reviews'

export function getStoredReviews(): ClientReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (!raw) return CLIENT_REVIEWS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge user reviews with default reviews, avoiding duplicates
      const defaultUnsaved = CLIENT_REVIEWS.filter(
        (r) => !parsed.some((p: ClientReview) => p.id === r.id),
      )
      return [...parsed, ...defaultUnsaved]
    }
    return CLIENT_REVIEWS
  } catch {
    return CLIENT_REVIEWS
  }
}

export function saveReview(newReview: ClientReview): void {
  try {
    const current = getStoredReviews()
    const updated = [newReview, ...current.filter((r) => r.id !== newReview.id)]
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('northlight:review_added', { detail: newReview }))
  } catch {
    // Ignore storage errors
  }
}
