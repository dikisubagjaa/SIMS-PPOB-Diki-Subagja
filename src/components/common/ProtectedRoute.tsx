import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import type { RootState } from '../../app/store'

interface Props {
    children: React.ReactElement
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
