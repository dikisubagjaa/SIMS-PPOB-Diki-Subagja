import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiOutlineAtSymbol, HiOutlineUser, HiOutlinePencil } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProfileThunk, updateProfileThunk, uploadProfileImageThunk } from '../../features/profile/profileSlice';
import { useToast } from '../../hooks/useToast';
import defaultAvatar from '../../assets/images/photo-profile.png';

const profileSchema = yup.object({
    first_name: yup.string().required('Nama depan wajib diisi').max(50, 'Maksimal 50 karakter'),
    last_name: yup.string().required('Nama belakang wajib diisi').max(50, 'Maksimal 50 karakter'),
})

interface ProfileFormData {
    first_name: string
    last_name: string
}

export default function EditProfilePage() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const initializedRef = useRef(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const profile = useAppSelector((state) => state.profile.data)
    const loading = useAppSelector((state) => state.profile.loading)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema) as never,
    })

    useEffect(() => {
        dispatch(fetchProfileThunk())
    }, [dispatch])

    useEffect(() => {
        if (profile && !initializedRef.current) {
            reset({ first_name: profile.first_name, last_name: profile.last_name })
            initializedRef.current = true
        }
    }, [profile, reset])

    const onSubmit = async (data: ProfileFormData) => {
        const result = await dispatch(updateProfileThunk(data))
        if (updateProfileThunk.fulfilled.match(result)) {
            showToast({ type: 'success', message: 'Profil berhasil diperbarui' })
            navigate('/profile')
        } else {
            showToast({ type: 'error', message: (result.payload as string) || 'Gagal memperbarui profil.' })
        }
    }

    const handleCancel = () => {
        navigate('/profile')
    }

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            showToast({ type: 'error', message: 'Format file tidak didukung. Gunakan JPEG atau PNG.' })
            return
        }

        if (file.size > 100 * 1024) {
            showToast({ type: 'error', message: 'Ukuran file terlalu besar. Maksimal 100KB.' })
            return
        }

        const result = await dispatch(uploadProfileImageThunk(file))
        if (uploadProfileImageThunk.fulfilled.match(result)) {
            showToast({ type: 'success', message: 'Foto profil berhasil diperbarui' })
        } else {
            showToast({ type: 'error', message: (result.payload as string) || 'Gagal mengunggah foto.' })
        }
    }

    const profileImage = profile?.profile_image && profile.profile_image !== ''
        ? profile.profile_image : defaultAvatar

    return (
        <div className="max-w-lg mx-auto py-8">
            <div className="flex flex-col items-center mb-8">
                <div className="relative cursor-pointer" onClick={handleImageClick}>
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border-2 border-slate-200"
                        onError={(e) => { (e.target as HTMLImageElement).src = defaultAvatar }}
                    />
                    <div className="absolute bottom-0 right-0 bg-white border border-slate-300 rounded-full p-1.5 shadow-sm">
                        <HiOutlinePencil size={16} className="text-slate-600" />
                    </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png"
                    aria-label="Upload foto profil" className="hidden" onChange={handleImageChange} />
                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                    {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                        <HiOutlineAtSymbol size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" value={profile?.email || ''} readOnly aria-label="Email"
                            className="w-full border border-gray-300 rounded-md py-3 pl-12 pr-4 outline-none bg-gray-200 text-slate-600 hover:cursor-not-allowed" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Depan</label>
                    <div className="relative">
                        <HiOutlineUser size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" {...register('first_name')}
                            className={`w-full border rounded-md py-3 pl-12 pr-4 outline-none bg-white ${
                                errors.first_name ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                            }`} />
                    </div>
                    {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang</label>
                    <div className="relative">
                        <HiOutlineUser size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" {...register('last_name')}
                            className={`w-full border rounded-md py-3 pl-12 pr-4 outline-none bg-white ${
                                errors.last_name ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                            }`} />
                    </div>
                    {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
                </div>

                <div className="space-y-3 pt-4">
                    <button type="submit" disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-3 rounded-md disabled:opacity-50">
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button type="button" onClick={handleCancel}
                        className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all font-semibold py-3 rounded-md">
                        Batalkan
                    </button>
                </div>
            </form>
        </div>
    )
}
