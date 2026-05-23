import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineAtSymbol,
    HiOutlineUser,
} from 'react-icons/hi';
import logo from '../../assets/images/logo.png';
import loginBanner from '../../assets/images/login-banner.png';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { registerThunk } from '../../features/auth/authSlice';
import { useToast } from '../../hooks/useToast';
import type { RegistrationRequest } from '../../types/auth';

const registrationSchema = yup.object({
    email: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
    first_name: yup.string().required('Nama depan wajib diisi').max(50, 'Maksimal 50 karakter')
        .test('not-whitespace', 'Nama depan wajib diisi', (v) => !!v?.trim()),
    last_name: yup.string().required('Nama belakang wajib diisi').max(50, 'Maksimal 50 karakter')
        .test('not-whitespace', 'Nama belakang wajib diisi', (v) => !!v?.trim()),
    password: yup.string().required('Password wajib diisi').min(8, 'Password minimal 8 karakter'),
    confirm_password: yup.string().required('Konfirmasi password wajib diisi')
        .oneOf([yup.ref('password')], 'Password tidak cocok'),
});

type RegistrationFormData = yup.InferType<typeof registrationSchema>;

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { loading } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegistrationFormData>({
        resolver: yupResolver(registrationSchema) as never,
    });

    const onSubmit = async (data: RegistrationFormData) => {
        const { confirm_password: _, ...registrationData } = data;
        void _;
        const result = await dispatch(registerThunk(registrationData as RegistrationRequest));

        if (registerThunk.fulfilled.match(result)) {
            showToast({ type: 'success', message: 'Registrasi berhasil! Silakan login.' });
            navigate('/login');
        } else {
            showToast({
                type: 'error',
                message: (result.payload as string) || 'Registrasi gagal. Silakan coba lagi.',
            });
        }
    };

    return (
        <div className="min-h-screen flex">
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

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className="relative">
                                <HiOutlineAtSymbol 
                                    size={22}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    placeholder="masukan email anda"
                                    {...register('email')}
                                    className={`w-full border rounded-md py-4 pl-12 pr-4 outline-none focus:border-red-500 ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <HiOutlineUser 
                                    size={22}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Nama depan"
                                    {...register('first_name')}
                                    className={`w-full border rounded-md py-4 pl-12 pr-4 outline-none focus:border-red-500 ${
                                        errors.first_name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {errors.first_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <HiOutlineUser 
                                    size={22}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Nama belakang"
                                    {...register('last_name')}
                                    className={`w-full border rounded-md py-4 pl-12 pr-4 outline-none focus:border-red-500 ${
                                        errors.last_name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {errors.last_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <HiOutlineLockClosed
                                    size={22}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Buat password"
                                    {...register('password')}
                                    className={`w-full border rounded-md py-4 pl-12 pr-12 outline-none focus:border-red-500 ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
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
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <HiOutlineLockClosed
                                    size={22}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Konfirmasi password"
                                    {...register('confirm_password')}
                                    className={`w-full border rounded-md py-4 pl-12 pr-12 outline-none focus:border-red-500 ${
                                        errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? (
                                        <HiOutlineEyeOff size={22} />
                                    ) : (
                                        <HiOutlineEye size={22} />
                                    )}
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Memproses...' : 'Daftar'}
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
            
            <div className="hidden lg:block lg:w-1/2">
                <img
                    src={loginBanner}
                    alt="login"
                    className="w-full h-screen object-cover"
                />
            </div>
        </div>
    );
}
