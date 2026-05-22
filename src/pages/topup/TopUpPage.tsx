import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

const paymentTypes = [
    { id: 'listrik', label: 'Listrik Prabayar' },
    { id: 'pdam', label: 'PDAM' },
    { id: 'pgn', label: 'PGN' },
    { id: 'telepon', label: 'Telepon Rumah' },
    { id: 'tv', label: 'TV Kabel' },
]

export default function TopUpPage() {
    const [showBalance, setShowBalance] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState('listrik')
    const [amount, setAmount] = useState('10.000')

    return (
        <div className="space-y-8">
            {/* Header: Profile + Balance */}
            <div className="grid grid-cols-2 gap-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                    <img src="/src/assets/images/photo-profile.png" alt="avatar" className="h-10 w-10 rounded-full object-cover mb-3" />
                    <div>
                        <p className="text-sm text-slate-500">Selamat datang,</p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Kristanto Wibowo</h2>
                    </div>
                </div>

                <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-r from-red-500 to-rose-500 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm opacity-90">Saldo anda</p>
                            <p className="mt-3 text-3xl font-semibold">
                                {showBalance ? 'Rp 0' : 'Rp ••••••••'}
                            </p>
                            <button
                                onClick={() => setShowBalance((current) => !current)}
                                className="mt-2 text-sm opacity-90 flex items-center gap-2"
                                type="button"
                            >
                                {showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}
                                {showBalance ? <HiOutlineEyeOff size={22} /> : <HiOutlineEye size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="space-y-6">
                    {/* Payment Section Label */}
                    <div>
                        <p className="text-lg font-semibold text-slate-900 mb-4">PemBayaran</p>
                    </div>

                    {/* Payment Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Layanan</label>
                        <select
                            value={selectedPayment}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            {paymentTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Masukkan Nominal</label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Masukkan nominal"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    {/* Pay Button */}
                    <button className="w-full rounded-lg bg-red-500 py-3 text-center font-semibold text-white hover:bg-red-600 transition-colors">
                        BAYAR
                    </button>
                </div>
            </div>
        </div>
    )
}
