import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { MdOutlinePayments } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProfileThunk } from '../../features/profile/profileSlice';
import { fetchBalanceThunk } from '../../features/balance/balanceSlice';
import { fetchServicesThunk } from '../../features/service/serviceSlice';
import { payServiceThunk } from '../../features/transaction/transactionSlice';
import { useToast } from '../../hooks/useToast';
import defaultAvatar from '../../assets/images/photo-profile.png';

function formatRupiah(amount: number): string {
    return 'Rp' + amount.toLocaleString('id-ID')
}

export default function TransactionPaymentPage() {
    const { serviceCode } = useParams<{ serviceCode: string }>()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { showToast } = useToast()

    const [showBalance, setShowBalance] = useState(false)
    const [isPaying, setIsPaying] = useState(false)

    const profile = useAppSelector((state) => state.profile.data)
    const balance = useAppSelector((state) => state.balance.amount)
    const services = useAppSelector((state) => state.service.services)

    const service = services.find((s) => s.service_code === serviceCode)

    useEffect(() => {
        dispatch(fetchProfileThunk())
        dispatch(fetchBalanceThunk())
        if (services.length === 0) {
            dispatch(fetchServicesThunk())
        }
    }, [dispatch, services.length])

    useEffect(() => {
        if (services.length > 0 && !service) {
            navigate('/dashboard', { replace: true })
        }
    }, [services, service, navigate])

    const handlePay = async () => {
        if (!service || isPaying) return
        setIsPaying(true)
        const result = await dispatch(payServiceThunk({ service_code: service.service_code }))
        if (payServiceThunk.fulfilled.match(result)) {
            showToast({ type: 'success', message: `Pembayaran ${service.service_name} sebesar ${formatRupiah(service.service_tariff)} berhasil` })
            dispatch(fetchBalanceThunk())
        } else {
            showToast({ type: 'error', message: (result.payload as string) || 'Pembayaran gagal.' })
        }
        setIsPaying(false)
    }

    const profileImage = profile?.profile_image && profile.profile_image !== ''
        ? profile.profile_image : defaultAvatar

    if (!service) {
        return <div className="text-center py-12 text-slate-500">Memuat layanan...</div>
    }

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
                <p className="text-sm text-slate-500">PemBayaran</p>
                <div className="flex items-center gap-3 mt-2 mb-6">
                    <img src={service.service_icon} alt={service.service_name} className="w-8 h-8 object-contain" />
                    <h3 className="text-xl font-bold text-slate-900">{service.service_name}</h3>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <MdOutlinePayments size={22}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" readOnly
                            aria-label="Nominal pembayaran"
                            value={service.service_tariff.toLocaleString('id-ID')}
                            className="w-full border border-gray-300 rounded-md py-4 pl-12 pr-4 outline-none bg-gray-50 text-slate-700 font-medium" />
                    </div>

                    <button type="button" onClick={handlePay} disabled={isPaying}
                        className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                        {isPaying ? 'Memproses...' : 'Bayar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
