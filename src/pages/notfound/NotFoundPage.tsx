import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">404 — Halaman tidak ditemukan</h1>
          <p className="mt-1 text-slate-500">Maaf, halaman yang Anda cari tidak tersedia.</p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:opacity-90"
          >
            Kembali ke Beranda
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md border border-slate-200 text-slate-700"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  )
}
