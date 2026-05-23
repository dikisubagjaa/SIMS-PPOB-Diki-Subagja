import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import balanceReducer from '../features/balance/balanceSlice'
import profileReducer from '../features/profile/profileSlice'
import serviceReducer from '../features/service/serviceSlice'
import transactionReducer from '../features/transaction/transactionSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        balance: balanceReducer,
        profile: profileReducer,
        service: serviceReducer,
        transaction: transactionReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
