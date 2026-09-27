import type { ReactNode } from 'react'

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-line/70 ${className ?? ''}`} />
}

export function PageState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="border border-line bg-cream px-8 py-16 text-center">
      <p className="font-display text-3xl text-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-mute">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
