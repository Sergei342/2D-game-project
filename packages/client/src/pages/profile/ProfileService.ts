import { BASE_URL } from './consts'
import { HttpStatus } from '../../shared/constants'

export interface UserProfile {
  id: number
  first_name: string
  second_name: string
  display_name: string | null
  login: string
  avatar: string | null
  email: string
  phone: string
}

export interface UpdateProfileData {
  first_name: string
  second_name: string
  display_name: string
  login: string
  email: string
  phone: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

export class UnauthorizedError extends Error {
  constructor(message = 'Не авторизован') {
    super(message)

    this.name = 'UnauthorizedError'
  }
}

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: 'include',
    ...options,
  })

  if (!res.ok) {
    if (res.status === HttpStatus.Unauthorized) {
      throw new UnauthorizedError()
    }

    const body = await res
      .json()
      .catch(() => ({ reason: 'Неизвестная ошибка' }))

    throw new Error(body.reason || `Ошибка ${res.status}`)
  }

  const text = await res.text()

  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

export const profileService = {
  async getUser(options?: {
    signal?: AbortSignal
  }): Promise<UserProfile | null> {
    return request<UserProfile | null>('/auth/user', {
      signal: options?.signal,
    })
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    return request<void>('/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    return request<UserProfile>('/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },

  async changeAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData()
    formData.append('avatar', file)

    return request<UserProfile>('/user/profile/avatar', {
      method: 'PUT',
      body: formData,
    })
  },

  avatarUrl(path: string | null): string | null {
    return path ? `${BASE_URL}/resources${path}` : null
  },
}
