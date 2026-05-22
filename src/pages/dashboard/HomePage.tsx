import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Link } from 'react-router-dom'

const services = [
    { label: 'PBB', icon: '/src/assets/images/PBB.png' },
    { label: 'Listrik', icon: '/src/assets/images/Listrik.png' },
    { label: 'Pulsa', icon: '/src/assets/images/Pulsa.png' },
    { label: 'PDAM', icon: '/src/assets/images/PDAM.png' },
    { label: 'PGN', icon: '/src/assets/images/PGN.png' },
    { label: 'TV Langganan', icon: '/src/assets/images/Televisi.png' },
    { label: 'Music', icon: '/src/assets/images/Musik.png' },
    { label: 'Voucher Game', icon: '/src/assets/images/game.png' },
    { label: 'Voucher Makanan', icon: '/src/assets/images/Voucher Makanan.png' },
    { label: 'Kurban', icon: '/src/assets/images/Kurban.png' },
    { label: 'Zakat', icon: '/src/assets/images/Zakat.png' },
    { label: 'Paket Data', icon: '/src/assets/images/Paket Data.png' },
]

const promos = [
    {
        id: 'banner-1',
        title: 'banner-1',
        image: '/src/assets/images/Banner 1.png',
    },
    {
        id: 'banner-2',
        title: 'banner-2',
        image: '/src/assets/images/Banner 2.png',
    },
    {
        id: 'banner-3',
        title: 'banner-3',
        image: '/src/assets/images/Banner 3.png',
    },
    {
        id: 'banner-4',
        title: 'banner-4',
        image: '/src/assets/images/Banner 4.png',
    },
    {
        id: 'banner-5',
        title: 'banner-5',
        image: '/src/assets/images/Banner 5.png',
    },
]

export default function HomePage() {
    const [showBalance, setShowBalance] = useState(false)

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                    <img src="/src/assets/images/photo-profile.png" alt="avatar" className="h-10 w-10 rounded-full object-cover mb-3" />
                    <div>
                        <p className="text-sm text-slate-500">Selamat datang,</p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Kristanto Wibowo</h2>
                    </div>
                </div>

                <div className="rounded-2xl p-6 shadow-lg bg-linear-to-r from-red-500 to-rose-500 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm opacity-90">Saldo anda</p>
                            <p className="mt-3 text-3xl font-semibold">
                                {showBalance ? 'Rp 6.240.000' : 'Rp ••••••••'}
                            </p>
                            <button
                                onClick={() => setShowBalance((current) => !current)}
                                className="mt-2 text-sm opacity-90 flex items-center gap-2"
                                type="button"
                            >
                                {showBalance ? 'Sembunyikan Saldo' : 'Lihat Saldo'}
                                {showBalance ? <HiOutlineEyeOff size={22} /> : <HiOutlineEye size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={30}
                    slidesPerView={12}
                >
                    {services.map((s) => {
                        return (
                            <SwiperSlide key={s.label}>
                                <div className="w-14 text-center">
                                    <img src={s.icon} alt={s.label} className="w-100" />
                                    <div className="text-xs text-slate-600">{s.label}</div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>

            {/* Promo slider */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-lg font-bold text-dark-500">Temukan promo menarik</p>
                    </div>
                </div>

                <Swiper
                    modules={[Pagination]}
                    spaceBetween={16}
                    slidesPerView={1}
                    breakpoints={{ 640: { slidesPerView: 1.3 }, 1024: { slidesPerView: 4.2 } }}
                >
                    {promos.map((promo) => (
                        <SwiperSlide key={promo.id}>
                            <Link href={promo.link} className="block">
                                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}
