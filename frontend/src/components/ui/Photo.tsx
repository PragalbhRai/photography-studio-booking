import { useState } from 'react'
import { cn } from '@/lib/cn'
import { IMAGES } from '@/lib/images'

type Props = {
  src: string
  alt: string
  className?: string
}

export function Photo({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? IMAGES.fallback : src}
      alt={alt}
      className={cn('h-full w-full object-cover', className)}
      onError={() => setFailed(true)}
    />
  )
}
