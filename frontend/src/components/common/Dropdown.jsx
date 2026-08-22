import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const alignStyles = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={cn(
            'absolute mt-2 min-w-[12rem] bg-[var(--color-card)] rounded-xl shadow-xl border border-[var(--color-border-subtle)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100',
            alignStyles[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ children, onClick, className, destructive = false, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer',
        destructive
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 text-slate-400" />}
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="h-px bg-slate-800 my-1" />
}

export default Dropdown
