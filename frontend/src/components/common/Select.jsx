import React from 'react'
import { cn } from '@/utils/cn'
import { ChevronDown } from 'lucide-react'

export const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full space-y-1.5 min-w-0', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-300 tracking-wide truncate-safe"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center min-w-0">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full min-h-[44px] appearance-none bg-slate-900/80 border border-slate-700/80 text-white text-sm rounded-xl px-3.5 py-2.5 pr-10 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 disabled:bg-slate-900/40 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer',
              error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/15 text-rose-200',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-slate-900 text-slate-400">
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const value = typeof opt === 'object' ? opt.value ?? opt.id : opt
              const labelText = typeof opt === 'object' ? opt.label ?? opt.name : opt
              return (
                <option key={String(value)} value={value} className="bg-slate-900 text-slate-100 py-1">
                  {labelText}
                </option>
              )
            })}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-slate-400 shrink-0">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select'
export default Select
