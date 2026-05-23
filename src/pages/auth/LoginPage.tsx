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
} from 'react-icons/hi'
import logo from '../../assets/images/logo.png';
import loginBanner from '../../assets/images/login-banner.png';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginThunk } from '../../features/auth/authSlice';
import { useToast } from '../../hooks/useToast';
import type { LoginRequest } from '../../types/auth';

interface LoginFormData {
  email: string
  password: string
}

const loginSchema = yup.object({
  email: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
  password: yup.string().required('Password wajib diisi').min(8, 'Password minimal 8 karakter'),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { loading } = useAppSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as never,
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginThunk(data as LoginRequest))

    if (loginThunk.fulfilled.match(result)) {
      navigate('/dashboard')
    } else if (loginThunk.rejected.match(result)) {
      showToast({
        type: 'error',
        message: (result.payload as string) || 'Login gagal. Silakan coba lagi.',
      })
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-10">
            <img src={logo} alt="logo" className="w-7" />
            <h1 className="text-3xl font-bold text-gray-800">SIMS PPOB</h1>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold leading-tight text-gray-800">
              Masuk atau buat akun untuk memulai
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
                <HiOutlineLockClosed
                  size={22}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="masukan password anda"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            belum punya akun?{' '}
            <Link to="/registration" className="text-red-600 font-semibold">
              registrasi di sini
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
  )
}
