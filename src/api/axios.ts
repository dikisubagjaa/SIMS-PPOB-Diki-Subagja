import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://take-home-test-api.nutech-integrasi.com',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: inject JWT Bearer token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
