import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'white' | 'outline-white'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        size === 'sm' && 'px-3.5 py-2 text-xs uppercase',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3.5 text-sm uppercase tracking-[0.16em]',
        variant === 'primary' && 'bg-ink text-cream hover:bg-ink/90 border border-ink',
        variant === 'secondary' && 'border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-cream',
        variant === 'white' && 'bg-[#f5f1eb] text-[#111111] hover:bg-white hover:shadow-lg border border-[#f5f1eb] font-semibold',
        variant === 'outline-white' && 'border border-white/60 bg-black/30 backdrop-blur-sm text-white hover:bg-white hover:text-ink font-semibold',
        variant === 'ghost' && 'text-ink/80 hover:text-ink',
        variant === 'danger' && 'border border-red-800/30 text-red-900 hover:bg-red-900 hover:text-white',
        className,
      )}
      {...props}
    />
  )
}
