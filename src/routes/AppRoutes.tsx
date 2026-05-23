import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import GuestRoute from '../components/common/GuestRoute'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import HomePage from '../pages/dashboard/HomePage'
import TopUpPage from '../pages/topup/TopUpPage'
import TransactionPage from '../pages/transaction/TransactionPage'
import TransactionPaymentPage from '../pages/transaction/TransactionPaymentPage'
import ProfilePage from '../pages/profile/ProfilePage'
import EditProfilePage from '../pages/profile/EditProfilePage'
import NotFoundPage from '../pages/notfound/NotFoundPage'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Guest routes - redirect to dashboard if already logged in */}
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/registration" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            {/* Protected routes - redirect to login if not authenticated */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<HomePage />} />
                <Route path="topup" element={<TopUpPage />} />
                <Route path="transaction" element={<TransactionPage />} />
                <Route path="transaction/:serviceCode" element={<TransactionPaymentPage />} />
                <Route path="profile">
                    <Route index element={<ProfilePage />} />
                    <Route path="edit" element={<EditProfilePage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}