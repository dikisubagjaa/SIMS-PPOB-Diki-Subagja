export interface Profile {
  email: string
  first_name: string
  last_name: string
  profile_image: string | null
}

export interface UpdateProfileRequest {
  first_name: string
  last_name: string
}
