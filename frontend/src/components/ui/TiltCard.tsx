import { useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/cn'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  maxTilt?: number // max tilt rotation in degrees
  perspective?: number // 3D perspective in px
  scale?: number // scale on hover
  glare?: boolean // specular sheen light reflection
  maxGlare?: number // max glare opacity (0 to 1)
}

export function TiltCard({
  children,
  className,
  innerClassName,
  maxTilt = 7,
  perspective = 1000,
  scale = 1.018,
  glare = true,
  maxGlare = 0.22,
  ...rest
}: TiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const isReducedMotion = useRef<boolean>(false)

  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isReducedMotion.current || !containerRef.current || !innerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const pctX = x / rect.width
      const pctY = y / rect.height

      // -maxTilt to +maxTilt
      const tiltX = -(pctY - 0.5) * (maxTilt * 2)
      const tiltY = (pctX - 0.5) * (maxTilt * 2)

      innerRef.current.style.transform = `perspective(${perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`

      if (glare && glareRef.current) {
        glareRef.current.style.opacity = `${maxGlare}`
        glareRef.current.style.background = `radial-gradient(circle at ${(pctX * 100).toFixed(1)}% ${(pctY * 100).toFixed(1)}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`
      }
    },
    [glare, maxGlare, maxTilt, perspective, scale],
  )

  const handleMouseEnter = useCallback(() => {
    if (isReducedMotion.current || !innerRef.current) return
    innerRef.current.style.transition = 'transform 120ms ease-out'
    if (glareRef.current) {
      glareRef.current.style.transition = 'opacity 250ms ease-out'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!innerRef.current) return
    innerRef.current.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
    innerRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`

    if (glare && glareRef.current) {
      glareRef.current.style.transition = 'opacity 400ms ease-out'
      glareRef.current.style.opacity = '0'
    }
  }, [glare, perspective])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('relative', className)}
      style={{ perspective: `${perspective}px` }}
      {...rest}
    >
      <div
        ref={innerRef}
        className={cn('relative h-full w-full will-change-transform transform-gpu', innerClassName)}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {glare && (
          <div
            ref={glareRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 mix-blend-overlay"
          />
        )}
      </div>
    </div>
  )
}
