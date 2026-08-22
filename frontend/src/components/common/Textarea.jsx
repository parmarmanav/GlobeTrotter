import React from 'react'
import { cn } from '@/utils/cn'

export const Textarea = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full space-y-1.5 min-w-0', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-300 tracking-wide truncate-safe"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder:text-slate-500 text-sm rounded-xl p-3.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 disabled:bg-slate-900/40 disabled:text-slate-500 disabled:cursor-not-allowed resize-y',
            error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/15 text-rose-200',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
