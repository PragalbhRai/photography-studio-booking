import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type FieldProps = {
  label: string
  error?: string
  hint?: string
}

export const TextField = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name
    return (
      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.16em] text-mute">{label}</span>
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            'w-full rounded-sm border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-ink',
            error && 'border-red-700',
            className,
          )}
          {...props}
        />
        {hint && !error ? <span className="block text-xs text-mute">{hint}</span> : null}
        {error ? <span className="block text-xs text-red-800">{error}</span> : null}
      </label>
    )
  },
)
TextField.displayName = 'TextField'

export const TextArea = forwardRef<HTMLTextAreaElement, FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name
    return (
      <label className="block space-y-1.5">
        <span className="text-xs uppercase tracking-[0.16em] text-mute">{label}</span>
        <textarea
          ref={ref}
          id={fieldId}
          className={cn(
            'w-full rounded-sm border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-ink',
            error && 'border-red-700',
            className,
          )}
          {...props}
        />
        {error ? <span className="block text-xs text-red-800">{error}</span> : null}
      </label>
    )
  },
)
TextArea.displayName = 'TextArea'
