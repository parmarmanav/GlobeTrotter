import React from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow active:scale-[0.98]',
  secondary: 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm hover:shadow active:scale-[0.98]',
  outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 active:bg-slate-100',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 active:bg-slate-200',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow active:scale-[0.98]',
  accent: 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow active:scale-[0.98]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
  icon: 'p-2 rounded-xl',
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
          'inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none',
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
        {children}
        {!isLoading && IconRight ? <IconRight className="w-4 h-4 shrink-0" /> : null}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
