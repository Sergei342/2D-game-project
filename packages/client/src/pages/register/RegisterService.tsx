export interface RegisterData {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export interface RegisterResponse {
  id?: number
  reason?: string
}

export const registerUser = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  try {
    const response = await fetch(
      'https://ya-praktikum.tech/api/v2/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    const result = await response.json()
    if (response.ok) {
      return { id: result.id }
    } else {
      return { reason: result.reason || 'Неизвестная ошибка' }
    }
  } catch (error) {
    console.error(error)
    return { reason: 'Ошибка сети, попробуйте позже' }
  }
}
