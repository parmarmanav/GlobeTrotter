import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import { User } from 'lucide-react'

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
}

export function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className,
  status,
}) {
  const [imageError, setImageError] = useState(false)

  const getInitials = (str) => {
    if (!str) return ''
    const parts = str.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return str.slice(0, 2).toUpperCase()
  }

  const initials = getInitials(name || alt)

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold overflow-hidden select-none',
          sizes[size],
          className
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-slate-400" />
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5',
            status === 'online' && 'bg-emerald-500',
            status === 'offline' && 'bg-slate-400',
            status === 'busy' && 'bg-rose-500'
          )}
        />
      )}
    </div>
  )
}

export default Avatar
