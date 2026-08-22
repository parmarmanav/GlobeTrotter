import React from 'react'
import { cn } from '@/utils/cn'

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('flex border-b border-[var(--color-border-subtle)] space-x-1 overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer',
              isActive
                ? 'border-teal-600 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
            )}
          >
            {Icon && <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-400' : 'text-slate-400')} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-xs rounded-full font-medium',
                  isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-800 text-slate-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
