import React from 'react'
import { useApp } from '@/context/AppContext'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/utils/cn'

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles = {
  success: 'bg-[var(--color-card)] border-emerald-200 text-slate-200 shadow-emerald-500/5',
  error: 'bg-[var(--color-card)] border-rose-200 text-slate-200 shadow-rose-500/5',
  info: 'bg-[var(--color-card)] border-sky-200 text-slate-200 shadow-sky-500/5',
  warning: 'bg-[var(--color-card)] border-amber-200 text-slate-200 shadow-amber-500/5',
}

const iconColors = {
  success: 'text-emerald-500',
  error: 'text-rose-500',
  info: 'text-sky-500',
  warning: 'text-amber-500',
}

export function ToastContainer() {
  const { toasts, removeToast } = useApp()

  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type] || Info
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in slide-in-from-bottom-3 duration-200',
              toastStyles[toast.type] || toastStyles.info
            )}
          >
            <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconColors[toast.type] || iconColors.info)} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-xs font-semibold text-white leading-tight">
                  {toast.title}
                </p>
              )}
              {toast.message && (
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-400 p-0.5 rounded cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
