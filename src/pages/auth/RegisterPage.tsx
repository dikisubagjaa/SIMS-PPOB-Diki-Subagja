import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineAtSymbol,
    HiOutlineUser,
} from 'react-icons/hi';
import logo from '../../assets/images/logo.png';
import loginBanner from '../../assets/images/login-banner.png';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen flex">
            {/* LEFT SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6">
                <div className="w-full max-w-md">
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <img
                            src={logo}
                            alt="logo"
                            className="w-7"
                        />

                        <h1 className="text-3xl font-bold text-gray-800">
                            SIMS PPOB
                        </h1>
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold leading-tight text-gray-800">
                            Lengkapi data untuk membuat akun
                        </h2>
                    </div>

                    <form className="space-y-6">
                        <div className="relative">
                            <HiOutlineAtSymbol 
                                size={22}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="email"
                                placeholder="masukan email anda"
                                className="w-full border border-gray-300 rounded-md py-4 pl-12 pr-4 outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="relative">
                            <HiOutlineUser 
                                size={22}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Nama depan"
                                className="w-full border border-gray-300 rounded-md py-4 pl-12 pr-4 outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="relative">
                            <HiOutlineUser 
                                size={22}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Nama belakang"
                                className="w-full border border-gray-300 rounded-md py-4 pl-12 pr-4 outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="relative">
                            <HiOutlineLockClosed
                                size={22}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Buat password"
                                className="w-full border border-gray-300 rounded-md py-4 pl-12 pr-12 outline-none focus:border-red-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? (
                                    <HiOutlineEyeOff size={22} />
                                ) : (
                                    <HiOutlineEye size={22} />
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <HiOutlineLockClosed
                                size={22}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Konfirmasi password"
                                className="w-full border border-gray-300 rounded-md py-4 pl-12 pr-12 outline-none focus:border-red-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? (
                                    <HiOutlineEyeOff size={22} />
                                ) : (
                                    <HiOutlineEye size={22} />
                                )}
                            </button>
                        </div>


                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-4 rounded-md"
                        >
                            Daftar
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6">
                        sudah punya akun?{' '}
                        <Link
                            to="/login"
                            className="text-red-600 font-semibold"
                        >
                            masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
            
            {/* RIGHT SIDE */}
            <div className="hidden lg:block lg:w-1/2">
                <img
                    src={loginBanner}
                    alt="login"
                    className="w-full h-screen object-cover"
                />
            </div>
        </div>
    )
}