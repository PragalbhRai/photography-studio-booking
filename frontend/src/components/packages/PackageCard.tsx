import { Link } from '@tanstack/react-router'
import { formatDuration, formatPrice } from '@/lib/format'
import type { Package } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'
import { Button } from '@/components/ui/Button'

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article className="group flex h-full flex-col border border-line bg-cream">
      <Link to="/packages/$packageId" params={{ packageId: pkg.id }} className="img-zoom block aspect-[4/5]">
        <Photo src={pkg.image_url} alt={pkg.name} />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-brass">{pkg.category}</p>
        <h3 className="mt-2 font-display text-3xl leading-tight">
          <Link to="/packages/$packageId" params={{ packageId: pkg.id }} className="hover:text-brass">
            {pkg.name}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-mute">
          {pkg.description || 'A carefully composed sitting with Northlight.'}
        </p>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-4">
          <div>
            <p className="font-display text-2xl">{formatPrice(pkg.price)}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-mute">{formatDuration(pkg.duration_minutes)}</p>
          </div>
          <Link to="/book" search={{ packageId: pkg.id }}>
            <Button size="sm">Book</Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
