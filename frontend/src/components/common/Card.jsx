import React from 'react'
import { cn } from '@/utils/cn'

export function Card({
  children,
  className,
  hoverable = false,
  glass = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-200 shadow-xs',
        hoverable && 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer',
        glass && 'glass-panel',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('flex items-center justify-between pb-4 border-b border-slate-100', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-base font-bold text-slate-900 font-display', className)}>{children}</h3>
}

export function CardDescription({ children, className }) {
  return <p className={cn('text-xs text-slate-500 mt-0.5', className)}>{children}</p>
}

export function CardContent({ children, className }) {
  return <div className={cn('pt-4', className)}>{children}</div>
}

export function CardFooter({ children, className }) {
  return <div className={cn('mt-4 pt-4 border-t border-slate-100 flex items-center justify-between', className)}>{children}</div>
}

export default Card
