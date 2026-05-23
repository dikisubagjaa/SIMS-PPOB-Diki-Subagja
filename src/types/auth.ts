export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegistrationRequest {
  email: string
  first_name: string
  last_name: string
  password: string
}
