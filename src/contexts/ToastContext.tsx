import { createContext, useCallback, useState, type ReactNode } from 'react';

export interface Toast {
  id: string
  type: 'success' | 'error'
  message: string
  duration: number
}

export interface ToastContextValue {
  toasts: Toast[]
  showToast: (params: { type: 'success' | 'error'; message: string }) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type, message }: { type: 'success' | 'error'; message: string }) => {
      const duration = type === 'success' ? 3000 : 5000
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

      const toast: Toast = { id, type, message, duration }
      setToasts((prev) => [...prev, toast])

      setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}
