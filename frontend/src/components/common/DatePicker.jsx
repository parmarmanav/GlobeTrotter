import React from 'react'
import { cn } from '@/utils/cn'
import { Calendar } from 'lucide-react'

export const DatePicker = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      id,
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
        <div className="relative flex items-center min-w-0">
          <div className="absolute left-3.5 pointer-events-none text-slate-400 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={cn(
              'w-full min-h-[44px] bg-slate-900/80 border border-slate-700/80 text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 disabled:bg-slate-900/40 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer [color-scheme:dark]',
              error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/15 text-rose-200',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
export default DatePicker
