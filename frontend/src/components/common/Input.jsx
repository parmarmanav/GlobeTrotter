import React from 'react'
import { cn } from '@/utils/cn'

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconRight: IconRight,
      className,
      containerClassName,
      id,
      type = 'text',
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
          {Icon && (
            <div className="absolute left-3 pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm rounded-xl px-3.5 py-2.5 transition-colors focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              Icon && 'pl-9.5',
              IconRight && 'pr-9.5',
              error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10',
              className
            )}
            {...props}
          />
          {IconRight && (
            <div className="absolute right-3 text-slate-400 flex items-center">
              {IconRight}
            </div>
          )}
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

Input.displayName = 'Input'
export default Input
