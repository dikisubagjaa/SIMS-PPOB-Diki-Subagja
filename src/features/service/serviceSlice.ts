import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import type { ApiResponse } from '../../types/api';
import type { Service, Banner } from '../../types/service';

export interface ServiceState {
  services: Service[]
  banners: Banner[]
  loading: boolean
}

const initialState: ServiceState = {
  services: [],
  banners: [],
  loading: false,
}

export const fetchServicesThunk = createAsyncThunk<
  Service[],
  void,
  { rejectValue: string }
>('service/fetchServices', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Service[]>>('/services')
    const { status, message, data } = response.data

    if (status !== 0 || !data) {
      return rejectWithValue(message)
    }

    return data
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Gagal memuat layanan.'
      )
    }
    return rejectWithValue('Gagal memuat layanan.')
  }
})

export const fetchBannersThunk = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>('service/fetchBanners', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Banner[]>>('/banner')
    const { status, message, data } = response.data

    if (status !== 0 || !data) {
      return rejectWithValue(message)
    }

    return data
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Gagal memuat banner.'
      )
    }
    return rejectWithValue('Gagal memuat banner.')
  }
})

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Services
    builder.addCase(fetchServicesThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchServicesThunk.fulfilled, (state, action) => {
      state.loading = false
      state.services = action.payload
    })
    builder.addCase(fetchServicesThunk.rejected, (state) => {
      state.loading = false
    })

    // Fetch Banners
    builder.addCase(fetchBannersThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchBannersThunk.fulfilled, (state, action) => {
      state.loading = false
      state.banners = action.payload
    })
    builder.addCase(fetchBannersThunk.rejected, (state) => {
      state.loading = false
    })
  },
})

export default serviceSlice.reducer
