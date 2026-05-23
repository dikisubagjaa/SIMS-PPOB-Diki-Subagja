import { useToast } from '../../hooks/useToast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex items-center justify-between rounded-lg px-4 py-3 text-white shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="ml-3 shrink-0 text-white/80 hover:text-white"
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
