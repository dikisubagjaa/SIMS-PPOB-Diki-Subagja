import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    isAuthenticated: boolean
}

const initialState: AuthState = {
    // default true for development as requested
    isAuthenticated: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state) {
            state.isAuthenticated = true
        },
        logout(state) {
            state.isAuthenticated = false
        },
        setAuth(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload
        },
    },
})

export const { login, logout, setAuth } = authSlice.actions
export default authSlice.reducer
