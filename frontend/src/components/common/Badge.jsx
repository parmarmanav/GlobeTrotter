import React from 'react'
import { cn } from '@/utils/cn'

const badgeVariants = {
  default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
  primary: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  secondary: 'bg-slate-800 text-slate-200 border-slate-700',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  accent: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
}

const badgeSizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot = false,
  icon: Icon,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full border backdrop-blur-xs truncate-safe shrink-0',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            variant === 'primary' && 'bg-indigo-400',
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'danger' && 'bg-rose-400',
            variant === 'info' && 'bg-sky-400',
            variant === 'default' && 'bg-slate-400',
            variant === 'purple' && 'bg-purple-400',
            variant === 'accent' && 'bg-orange-400'
          )}
        />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="truncate-safe">{children}</span>
    </span>
  )
}

export default Badge
