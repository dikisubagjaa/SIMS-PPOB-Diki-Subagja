import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineAtSymbol, HiOutlineUser } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProfileThunk } from '../../features/profile/profileSlice';
import { logout } from '../../features/auth/authSlice';
import defaultAvatar from '../../assets/images/photo-profile.png';

export default function ProfilePage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const profile = useAppSelector((state) => state.profile.data)

    useEffect(() => {
        dispatch(fetchProfileThunk())
    }, [dispatch])

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const profileImage = profile?.profile_image && profile.profile_image !== ''
        ? profile.profile_image : defaultAvatar

    return (
        <div className="max-w-lg mx-auto py-8">
            <div className="flex flex-col items-center mb-8">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-2 border-slate-200"
                    onError={(e) => { (e.target as HTMLImageElement).src = defaultAvatar }}
                />
                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                    {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
                </h2>
            </div>

            <div className="space-y-5">
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
                        <input type="text" value={profile?.first_name || ''} readOnly aria-label="Nama Depan"
                            className="w-full border border-gray-300 rounded-md py-3 pl-12 pr-4 outline-none bg-gray-200 text-slate-600 hover:cursor-not-allowed" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang</label>
                    <div className="relative">
                        <HiOutlineUser size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={profile?.last_name || ''} readOnly aria-label="Nama Belakang"
                            className="w-full border border-gray-300 rounded-md py-3 pl-12 pr-4 outline-none bg-gray-200 text-slate-600 hover:cursor-not-allowed" />
                    </div>
                </div>

                <div className="space-y-3 pt-4">
                    <button type="button" onClick={() => navigate('/profile/edit')}
                        className="w-full bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-3 rounded-md">
                        Edit Profil
                    </button>
                    <button type="button" onClick={handleLogout}
                        className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all font-semibold py-3 rounded-md">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
