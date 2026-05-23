import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import type { ApiResponse } from '../../types/api';
import type { Transaction, TransactionRequest } from '../../types/transaction';

interface HistoryResponse {
    offset: number
    limit: number
    records: Transaction[]
}

export interface TransactionState {
    records: Transaction[]
    offset: number
    limit: number
    hasMore: boolean
    loading: boolean
}

const initialState: TransactionState = {
    records: [],
    offset: 0,
    limit: 5,
    hasMore: true,
    loading: false,
}

export const payServiceThunk = createAsyncThunk<
    Transaction,
    TransactionRequest,
    { rejectValue: string }
>('transaction/pay', async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post<ApiResponse<Transaction>>(
            '/transaction', data
        )
        const { status, message, data: resData } = response.data

        if (status !== 0 || !resData) {
            return rejectWithValue(message)
        }

        return resData
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string } } }
            return rejectWithValue(
                axiosError.response?.data?.message || 'Pembayaran gagal.'
            )
        }
        return rejectWithValue('Pembayaran gagal.')
    }
})

export const fetchTransactionHistoryThunk = createAsyncThunk<
    Transaction[],
    { offset: number; limit: number },
    { rejectValue: string }
>('transaction/fetchHistory', async ({ offset, limit }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get<ApiResponse<HistoryResponse>>(
            `/transaction/history?offset=${offset}&limit=${limit}`
        )
        const { status, message, data } = response.data

        if (status !== 0 || !data) {
            return rejectWithValue(message)
        }

        return data.records
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string } } }
            return rejectWithValue(
                axiosError.response?.data?.message || 'Gagal memuat riwayat transaksi.'
            )
        }
        return rejectWithValue('Gagal memuat riwayat transaksi.')
    }
})

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        clearTransactions(state) {
            state.records = []
            state.offset = 0
            state.hasMore = true
        },
    },
    extraReducers: (builder) => {
        builder.addCase(payServiceThunk.pending, (state) => {
            state.loading = true
        })
        builder.addCase(payServiceThunk.fulfilled, (state) => {
            state.loading = false
        })
        builder.addCase(payServiceThunk.rejected, (state) => {
            state.loading = false
        })

        builder.addCase(fetchTransactionHistoryThunk.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchTransactionHistoryThunk.fulfilled, (state, action) => {
            state.loading = false
            const newRecords = action.payload
            state.records = [...state.records, ...newRecords]
            state.offset += state.limit
            state.hasMore = newRecords.length === state.limit
        })
        builder.addCase(fetchTransactionHistoryThunk.rejected, (state) => {
            state.loading = false
        })
    },
})

export const { clearTransactions } = transactionSlice.actions
export default transactionSlice.reducer
