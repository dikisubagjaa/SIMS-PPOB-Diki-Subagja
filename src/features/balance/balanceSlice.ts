import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import type { ApiResponse } from '../../types/api';
import type { Balance } from '../../types/balance';

export interface BalanceState {
  amount: number
  loading: boolean
}

const initialState: BalanceState = {
  amount: 0,
  loading: false,
}

export const fetchBalanceThunk = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>('balance/fetchBalance', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Balance>>('/balance')
    const { status, message, data } = response.data

    if (status !== 0 || !data) {
      return rejectWithValue(message)
    }

    return data.balance
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Gagal mengambil data saldo.'
      )
    }
    return rejectWithValue('Gagal mengambil data saldo.')
  }
})

export const topUpThunk = createAsyncThunk<
  number, 
  number, 
  { rejectValue: string }
>('balance/topUp', async (amount, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<Balance>>('/topup', {
      top_up_amount: amount,
    })
    const { status, message, data } = response.data

    if (status !== 0 || !data) {
      return rejectWithValue(message)
    }

    return data.balance
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Top up gagal. Silakan coba lagi.'
      )
    }
    return rejectWithValue('Top up gagal. Silakan coba lagi.')
  }
})

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    clearBalance(state) {
      state.amount = 0
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBalanceThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchBalanceThunk.fulfilled, (state, action) => {
      state.loading = false
      state.amount = action.payload
    })
    builder.addCase(fetchBalanceThunk.rejected, (state) => {
      state.loading = false
    })

    builder.addCase(topUpThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(topUpThunk.fulfilled, (state, action) => {
      state.loading = false
      state.amount = action.payload
    })
    builder.addCase(topUpThunk.rejected, (state) => {
      state.loading = false
    })
  },
})

export const { clearBalance } = balanceSlice.actions
export default balanceSlice.reducer
