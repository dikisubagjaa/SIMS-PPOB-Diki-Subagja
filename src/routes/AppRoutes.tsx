import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import HomePage from '../pages/dashboard/HomePage'
import TopUpPage from '../pages/topup/TopUpPage'
import TransactionPage from '../pages/transaction/TransactionPage'
import HistoryPage from '../pages/history/HistoryPage'
import ProfilePage from '../pages/profile/ProfilePage'
import EditProfilePage from '../pages/profile/EditProfilePage'
import NotFoundPage from '../pages/notfound/NotFoundPage'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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
                <Route path="history" element={<HistoryPage />} />
                <Route path="profile">
                    <Route index element={<ProfilePage />} />
                    <Route path="edit" element={<EditProfilePage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}