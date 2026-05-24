import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';
import type { ApiResponse } from '../../types/api';
import type { Profile, UpdateProfileRequest } from '../../types/profile';

export interface ProfileState {
  data: Profile | null
  loading: boolean
}

const initialState: ProfileState = {
  data: null,
  loading: false,
}

export const fetchProfileThunk = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string }
>('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Profile>>('/profile')
    const { status, message, data } = response.data

    if (status !== 0 || !data) {
      return rejectWithValue(message)
    }

    return data
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Gagal mengambil data profil.'
      )
    }
    return rejectWithValue('Gagal mengambil data profil.')
  }
})

export const updateProfileThunk = createAsyncThunk<
  Profile,
  UpdateProfileRequest,
  { rejectValue: string; state: { profile: ProfileState } }
>('profile/update', async (profileData, { rejectWithValue, getState }) => {
  try {
    const response = await axiosInstance.put<ApiResponse<Profile>>('/profile/update', profileData)
    const { status, message, data } = response.data

    if (status !== 0) {
      return rejectWithValue(message)
    }

    const currentProfile = getState().profile.data
    const updatedProfile = data || currentProfile

    if (!updatedProfile) {
      return rejectWithValue(message || 'Gagal memperbarui profil.')
    }

    return {
      ...updatedProfile,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Gagal memperbarui profil.'
      )
    }
    return rejectWithValue('Gagal memperbarui profil.')
  }
})

export const uploadProfileImageThunk = createAsyncThunk<
  Profile,
  File,
  { rejectValue: string }
>('profile/uploadImage', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.put<ApiResponse<Profile>>('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const { status, message, data } = response.data

    if (status !== 0 || !data) {
      return rejectWithValue(message)
    }

    return data
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(
        axiosError.response?.data?.message || 'Gagal mengunggah foto profil.'
      )
    }
    return rejectWithValue('Gagal mengunggah foto profil.')
  }
})

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.data = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfileThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchProfileThunk.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchProfileThunk.rejected, (state) => {
      state.loading = false
    })

    builder.addCase(updateProfileThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(updateProfileThunk.rejected, (state) => {
      state.loading = false
    })

    builder.addCase(uploadProfileImageThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(uploadProfileImageThunk.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(uploadProfileImageThunk.rejected, (state) => {
      state.loading = false
    })
  },
})

export const { clearProfile } = profileSlice.actions
export default profileSlice.reducer
