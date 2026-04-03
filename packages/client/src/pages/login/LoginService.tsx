import { BASE_URL } from '@/shared/constants'

export interface LoginData {
  login: string
  password: string
}

export interface LoginResponse {
  ok?: boolean
  reason?: string
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    let result: any
    try {
      result = await response.json()
    } catch (error) {
      console.error('JSON parse error:', error)
    }

    if (response.ok) {
      return { ok: true }
    }
    return {
      ok: false,
      reason: result.reason || 'Неизвестная ошибка',
    }
  } catch (error) {
    console.error('Network error:', error)

    return {
      ok: false,
      reason: 'Ошибка сети, попробуйте позже',
    }
  }
}

export const logoutUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    return response.ok
  } catch (error) {
    console.error('Logout error:', error)
    return false
  }
}
