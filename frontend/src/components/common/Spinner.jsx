import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

export function Spinner({ size = 'md', className, label }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-teal-600', sizes[size])} />
      {label && <p className="text-xs text-slate-500 font-medium">{label}</p>}
    </div>
  )
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[350px] p-8">
      <Spinner size="lg" label={message} />
    </div>
  )
}

export default Spinner
