import { Link } from '@tanstack/react-router'
import { portraitForId } from '@/lib/images'
import type { PhotographerListItem } from '@/lib/types'
import { Photo } from '@/components/ui/Photo'

export function PhotographerCard({
  photographer,
  portraitUrl,
}: {
  photographer: PhotographerListItem
  portraitUrl?: string
}) {
  const src = portraitUrl || portraitForId(photographer.id, photographer.full_name)
  return (
    <article className="group">
      <Link
        to="/photographers/$photographerId"
        params={{ photographerId: photographer.id }}
        className="img-zoom block aspect-[3/4]"
      >
        <Photo src={src} alt={photographer.full_name} />
      </Link>
      <div className="pt-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-brass">
          {photographer.specialties.slice(0, 3).join(' · ') || 'Photographer'}
        </p>
        <h3 className="mt-1 font-display text-3xl">
          <Link to="/photographers/$photographerId" params={{ photographerId: photographer.id }}>
            {photographer.full_name}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mute">
          {photographer.bio || 'A Northlight photographer.'}
        </p>
        <Link
          to="/photographers/$photographerId"
          params={{ photographerId: photographer.id }}
          className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-ink underline decoration-line underline-offset-8 hover:decoration-ink"
        >
          View profile
        </Link>
      </div>
    </article>
  )
}
