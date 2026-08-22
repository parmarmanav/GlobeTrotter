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
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={cn(
              'w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-3.5 py-2.5 transition-colors focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer',
              error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
export default DatePicker
