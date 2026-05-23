import { useEffect, useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProfileThunk } from '../../features/profile/profileSlice';
import { fetchBalanceThunk } from '../../features/balance/balanceSlice';
import { fetchTransactionHistoryThunk, clearTransactions } from '../../features/transaction/transactionSlice';
import { useToast } from '../../hooks/useToast';
import defaultAvatar from '../../assets/images/photo-profile.png';

function formatRupiah(amount: number): string {
    return 'Rp.' + amount.toLocaleString('id-ID')
}

function formatDate(isoDate: string): string {
    const date = new Date(isoDate)
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
    return date.toLocaleDateString('id-ID', options) + ' WIB'
}

export default function TransactionPage() {
    const [showBalance, setShowBalance] = useState(false)
    const dispatch = useAppDispatch()
    const { showToast } = useToast()

    const profile = useAppSelector((state) => state.profile.data)
    const balance = useAppSelector((state) => state.balance.amount)
    const { records, offset, limit, hasMore, loading } = useAppSelector((state) => state.transaction)

    useEffect(() => {
        dispatch(fetchProfileThunk())
        dispatch(fetchBalanceThunk())
        dispatch(clearTransactions())
        dispatch(fetchTransactionHistoryThunk({ offset: 0, limit: 5 }))
    }, [dispatch])

    const handleShowMore = async () => {
        const result = await dispatch(fetchTransactionHistoryThunk({ offset, limit }))
        if (fetchTransactionHistoryThunk.rejected.match(result)) {
            showToast({ type: 'error', message: (result.payload as string) || 'Gagal memuat riwayat.' })
        }
    }

    const profileImage = profile?.profile_image && profile.profile_image !== ''
        ? profile.profile_image : defaultAvatar

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <img src={profileImage} alt="avatar" className="h-16 w-16 rounded-full object-cover mb-3"
                        onError={(e) => { (e.target as HTMLImageElement).src = defaultAvatar }} />
                    <p className="text-lg text-slate-500">Selamat datang,</p>
                    <h2 className="mt-1 text-3xl font-bold text-slate-900">
                        {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
                    </h2>
                </div>
                <div className="rounded-2xl p-6 shadow-lg bg-linear-to-r from-red-500 to-red-400 text-white">
                    <p className="text-sm opacity-90">Saldo anda</p>
                    <p className="mt-3 text-3xl font-bold">
                        {showBalance ? formatRupiah(balance) : 'Rp ••••••••'}
                    </p>
                    <button onClick={() => setShowBalance((c) => !c)}
                        className="mt-3 text-sm opacity-90 flex items-center gap-2" type="button">
                        {showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}
                        {showBalance ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Semua Transaksi</h3>

                {records.length === 0 && !loading && (
                    <p className="text-center text-slate-400 py-12">Maaf tidak ada histori transaksi saat ini</p>
                )}

                <div className="space-y-3">
                    {records.map((tx, idx) => {
                        const isTopUp = tx.transaction_type === 'TOPUP'
                        return (
                            <div key={tx.invoice_number + idx} className="flex items-center justify-between border border-slate-200 rounded-lg p-4">
                                <div>
                                    <p className={`text-lg font-semibold ${isTopUp ? 'text-green-500' : 'text-red-500'}`}>
                                        {isTopUp ? '+' : '-'} {formatRupiah(tx.total_amount)}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">{formatDate(tx.created_on)}</p>
                                </div>
                                <p className="text-sm text-slate-600">{tx.description}</p>
                            </div>
                        )
                    })}
                </div>

                {hasMore && records.length > 0 && (
                    <div className="text-center mt-6">
                        <button type="button" onClick={handleShowMore} disabled={loading}
                            className="text-red-600 font-semibold hover:text-red-700 disabled:opacity-50">
                            {loading ? 'Memuat...' : 'Show more'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
