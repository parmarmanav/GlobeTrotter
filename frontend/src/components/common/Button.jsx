import React from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

const variants = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-indigo-400/20 active:scale-[0.98]',
  secondary:
    'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 shadow-md hover:border-slate-600 active:scale-[0.98]',
  outline:
    'border border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 hover:text-white hover:border-slate-600 active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-white active:bg-slate-800',
  danger:
    'bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500/30 shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 active:scale-[0.98]',
  accent:
    'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 border border-orange-400/20 active:scale-[0.98]',
}

const sizes = {
  xs: 'px-2.5 py-1 text-xs font-medium rounded-lg gap-1 min-h-[32px]',
  sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5 min-h-[36px]',
  md: 'px-4.5 py-2.5 text-sm font-semibold rounded-xl gap-2 min-h-[44px]',
  lg: 'px-6 py-3 text-base font-bold rounded-xl gap-2.5 min-h-[48px]',
  icon: 'p-2.5 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center',
}

export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      icon: Icon,
      iconRight: IconRight,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none truncate-safe',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : Icon ? (
          <Icon className="w-4 h-4 shrink-0" />
        ) : null}
        {children && <span className="truncate-safe">{children}</span>}
        {!isLoading && IconRight ? <IconRight className="w-4 h-4 shrink-0" /> : null}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
