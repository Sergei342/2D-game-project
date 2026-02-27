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
    const response = await fetch(
      'https://ya-praktikum.tech/api/v2/auth/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    console.log('response', response)

    let result: any
    try {
      result = await response.json()
    } catch {
      result = {}
    }

    if (response.ok) {
      return { ok: true }
    } else {
      return { ok: false, reason: result.reason || 'Неизвестная ошибка' }
    }
  } catch (error) {
    console.error(error)
    return { reason: 'Ошибка сети, попробуйте позже' }
  }
}
