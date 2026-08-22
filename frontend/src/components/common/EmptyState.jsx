import React from 'react'
import { FolderOpen } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/utils/cn'

export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no records matching your criteria yet.',
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[var(--color-border-subtle)] bg-slate-800/50/50 max-w-lg mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-teal-100 flex items-center justify-center text-indigo-400 mb-4 shadow-md">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-white font-display">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
