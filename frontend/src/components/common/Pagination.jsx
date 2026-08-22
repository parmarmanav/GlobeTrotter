import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) {
  if (totalPages <= 1) return null

  const renderPages = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          type="button"
          onClick={() => onPageChange(1)}
          className="w-8 h-8 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="start-dots" className="w-6 text-center text-xs text-slate-400">
            ...
          </span>
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === currentPage
      pages.push(
        <button
          key={i}
          type="button"
          onClick={() => onPageChange(i)}
          className={cn(
            'w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer',
            isActive
              ? 'bg-teal-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-dots" className="w-6 text-center text-xs text-slate-400">
            ...
          </span>
        )
      }
      pages.push(
        <button
          key={totalPages}
          type="button"
          onClick={() => onPageChange(totalPages)}
          className="w-8 h-8 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {totalPages}
        </button>
      )
    }

    return pages
  }

  return (
    <div className={cn('flex items-center justify-center gap-1.5 py-4', className)}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {renderPages()}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Pagination
