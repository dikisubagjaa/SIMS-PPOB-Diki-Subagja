import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'
import type { ApiResponse } from '../../types/api'
import type { LoginRequest, LoginResponse, RegistrationRequest } from '../../types/auth'

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

// Check localStorage for existing token on app init
const storedToken = localStorage.getItem('token')

const initialState: AuthState = {
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
}

export const loginThunk = createAsyncThunk<
  string, // return type: the token
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/login', credentials)
    const { status, message, data } = response.data

    if (status !== 0 || !data) {
      return rejectWithValue(message)
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token)
    return data.token
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Login gagal. Silakan coba lagi.'
      )
    }
    return rejectWithValue('Login gagal. Silakan coba lagi.')
  }
})

export const registerThunk = createAsyncThunk<
  string, // return type: the success message
  RegistrationRequest,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>('/registration', data)
    const { status, message } = response.data

    if (status !== 0) {
      return rejectWithValue(message)
    }

    return message
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.'
      )
    }
    return rejectWithValue('Registrasi gagal. Silakan coba lagi.')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false
      state.token = action.payload
      state.isAuthenticated = true
    })
    builder.addCase(loginThunk.rejected, (state) => {
      state.loading = false
      state.token = null
      state.isAuthenticated = false
    })

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(registerThunk.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(registerThunk.rejected, (state) => {
      state.loading = false
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
