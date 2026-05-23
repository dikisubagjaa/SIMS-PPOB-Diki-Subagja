import 'swiper/css';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProfileThunk } from '../../features/profile/profileSlice';
import { fetchBalanceThunk } from '../../features/balance/balanceSlice';
import { fetchServicesThunk, fetchBannersThunk } from '../../features/service/serviceSlice';
import { useToast } from '../../hooks/useToast';
import defaultAvatar from '../../assets/images/photo-profile.png';

function formatRupiah(amount: number): string {
    return 'Rp ' + amount.toLocaleString('id-ID')
}

export default function HomePage() {
    const [showBalance, setShowBalance] = useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const profile = useAppSelector((state) => state.profile.data)
    const balance = useAppSelector((state) => state.balance.amount)
    const services = useAppSelector((state) => state.service.services)
    const banners = useAppSelector((state) => state.service.banners)

    useEffect(() => {
        const fetchData = async () => {
            const [profileResult, balanceResult, servicesResult, bannersResult] = await Promise.all([
                dispatch(fetchProfileThunk()),
                dispatch(fetchBalanceThunk()),
                dispatch(fetchServicesThunk()),
                dispatch(fetchBannersThunk()),
            ])

            if (fetchProfileThunk.rejected.match(profileResult)) {
                showToast({ type: 'error', message: profileResult.payload as string })
            }
            if (fetchBalanceThunk.rejected.match(balanceResult)) {
                showToast({ type: 'error', message: balanceResult.payload as string })
            }
            if (fetchServicesThunk.rejected.match(servicesResult)) {
                showToast({ type: 'error', message: servicesResult.payload as string })
            }
            if (fetchBannersThunk.rejected.match(bannersResult)) {
                showToast({ type: 'error', message: bannersResult.payload as string })
            }
        }
        fetchData()
    }, [dispatch, showToast])

    const profileImage = profile?.profile_image && profile.profile_image !== ''
        ? profile.profile_image
        : defaultAvatar

    const handleServiceClick = (serviceCode: string) => {
        navigate(`/transaction/${serviceCode}`)
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <img
                        src={profileImage}
                        alt="avatar"
                        className="h-16 w-16 rounded-full object-cover mb-3"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultAvatar
                        }}
                    />
                    <div>
                        <p className="text-lg text-slate-500">Selamat datang,</p>
                        <h2 className="mt-1 text-3xl font-bold text-slate-900">
                            {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
                        </h2>
                    </div>
                </div>

                <div className="rounded-2xl p-6 shadow-lg bg-linear-to-r from-red-500 to-red-400 text-white">
                    <p className="text-sm opacity-90">Saldo anda</p>
                    <p className="mt-3 text-3xl font-bold">
                        {showBalance ? formatRupiah(balance) : 'Rp ••••••••'}
                    </p>
                    <button
                        onClick={() => setShowBalance((current) => !current)}
                        className="mt-3 text-sm opacity-90 flex items-center gap-2 hover:opacity-100 transition-opacity"
                        type="button"
                    >
                        {showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}
                        {showBalance ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                    </button>
                </div>
            </div>

            {services.length > 0 && (
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-4">
                    {services.map((service) => (
                        <button
                            key={service.service_code}
                            type="button"
                            onClick={() => handleServiceClick(service.service_code)}
                            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={service.service_icon}
                                alt={service.service_name}
                                className="w-12 h-12 object-contain"
                            />
                            <span className="text-xs text-center text-slate-700 leading-tight">
                                {service.service_name}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {banners.length > 0 && (
                <div>
                    <p className="text-lg font-bold text-slate-800 mb-4">Temukan promo menarik</p>
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4.5 },
                        }}
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.banner_name}>
                                <img
                                    src={banner.banner_image}
                                    alt={banner.banner_name}
                                    className="w-full rounded-lg object-cover"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    )
}
