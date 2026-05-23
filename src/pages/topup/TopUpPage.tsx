import { useEffect, useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { MdOutlinePayments } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProfileThunk } from '../../features/profile/profileSlice';
import { fetchBalanceThunk, topUpThunk } from '../../features/balance/balanceSlice';
import { useToast } from '../../hooks/useToast';
import defaultAvatar from '../../assets/images/photo-profile.png';

const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000]

function formatRupiah(amount: number): string {
    return 'Rp' + amount.toLocaleString('id-ID')
}

const topUpSchema = yup.object({
    amount: yup.number()
        .typeError('Nominal harus berupa angka')
        .required('Nominal wajib diisi')
        .min(10000, 'Minimum top up Rp10.000')
        .max(1000000, 'Maksimum top up Rp1.000.000'),
})

interface TopUpFormData {
    amount: number
}

export default function TopUpPage() {
    const [showBalance, setShowBalance] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const dispatch = useAppDispatch()
    const { showToast } = useToast()
    const profile = useAppSelector((state) => state.profile.data)
    const balance = useAppSelector((state) => state.balance.amount)

    const [nominal, setNominal] = useState('')

    const {
        setValue,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<TopUpFormData>({
        resolver: yupResolver(topUpSchema) as never,
        mode: 'onChange',
        defaultValues: { amount: undefined },
    })

    useEffect(() => {
        dispatch(fetchProfileThunk())
        dispatch(fetchBalanceThunk())
    }, [dispatch])

    const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '')
        setNominal(raw)
        const num = raw ? parseInt(raw, 10) : undefined
        setValue('amount', num as number, { shouldValidate: true })
    }

    const handleQuickSelect = (amount: number) => {
        setNominal(amount.toString())
        setValue('amount', amount, { shouldValidate: true })
    }

    const onSubmit = async (data: TopUpFormData) => {
        if (isSubmitting) return
        setIsSubmitting(true)
        const result = await dispatch(topUpThunk(data.amount))
        if (topUpThunk.fulfilled.match(result)) {
            showToast({ type: 'success', message: `Top Up sebesar ${formatRupiah(data.amount)} berhasil` })
            reset()
            setNominal('')
            dispatch(fetchBalanceThunk())
        } else {
            showToast({ type: 'error', message: (result.payload as string) || 'Top up gagal.' })
        }
        setIsSubmitting(false)
    }

    const profileImage = profile?.profile_image && profile.profile_image !== ''
        ? profile.profile_image : defaultAvatar

    const numericValue = nominal ? parseInt(nominal, 10) : 0
    const displayValue = nominal ? numericValue.toLocaleString('id-ID') : ''

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

            <form onSubmit={handleSubmit(onSubmit)}>
                <p className="text-sm text-slate-500">Silahkan masukan</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Nominal Top Up</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative">
                            <MdOutlinePayments size={22}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={displayValue}
                                onChange={handleNominalChange}
                                placeholder="masukan nominal Top Up"
                                className={`w-full border rounded-md py-4 pl-12 pr-4 outline-none focus:border-red-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`} />
                        </div>
                        {errors.amount && (
                            <p className="text-red-500 text-sm">{errors.amount.message}</p>
                        )}
                        <button type="submit" disabled={!isValid || isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Memproses...' : 'Top Up'}
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {quickAmounts.map((amount) => (
                            <button key={amount} type="button" onClick={() => handleQuickSelect(amount)}
                                className={`border rounded-md py-3 text-sm font-medium transition-colors ${numericValue === amount ? 'border-red-500 text-red-600 bg-red-50' : 'border-gray-300 text-slate-700 hover:border-red-400'}`}>
                                {formatRupiah(amount)}
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    )
}
