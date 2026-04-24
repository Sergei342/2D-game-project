import { BASE_URL } from '@/shared/constants'

export const getYandexServiceId = async (): Promise<{ service_id: string }> => {
  const response = await fetch(`${BASE_URL}/oauth/yandex/service-id`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.reason || 'Не удалось получить service_id')
  }

  return response.json()
}

export const signInWithYandex = async (
  code: string,
  redirect_uri: string
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/oauth/yandex`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code, redirect_uri }),
  })

  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.reason || 'Ошибка авторизации через Яндекс')
  }
}
