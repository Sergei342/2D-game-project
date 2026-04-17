import { SERVER_HOST } from '@/constants'
import type { Friend } from '@/slices/friendsSlice'

class FriendsApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FriendsApiError'
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const parseFriend = (value: unknown): Friend => {
  if (!isRecord(value)) {
    throw new FriendsApiError('Некорректный формат друга')
  }

  if (typeof value.name !== 'string') {
    throw new FriendsApiError('Поле name отсутствует или имеет неверный тип')
  }

  if (typeof value.secondName !== 'string') {
    throw new FriendsApiError(
      'Поле secondName отсутствует или имеет неверный тип'
    )
  }

  const avatar =
    typeof value.avatar === 'string'
      ? value.avatar
      : value.avatar == null
      ? null
      : (() => {
          throw new FriendsApiError('Поле avatar имеет некорректный формат')
        })()

  return {
    name: value.name,
    secondName: value.secondName,
    avatar,
  }
}

const parseFriends = (value: unknown): Friend[] => {
  if (!Array.isArray(value)) {
    throw new FriendsApiError('Некорректный формат списка друзей')
  }

  return value.map(parseFriend)
}

const parseApiError = async (response: Response) => {
  let errorMessage = `Ошибка ${response.status}`

  try {
    const errorBody: unknown = await response.json()

    if (
      isRecord(errorBody) &&
      typeof errorBody.reason === 'string' &&
      errorBody.reason
    ) {
      errorMessage = errorBody.reason
    }
  } catch (error) {
    console.error('Не удалось распарсить ошибку ответа /friends', error)
  }

  return errorMessage
}

export const fetchFriends = async (): Promise<Friend[]> => {
  const url = `${SERVER_HOST}/friends`
  const response = await fetch(url, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new FriendsApiError(await parseApiError(response))
  }

  const payload: unknown = await response.json()

  return parseFriends(payload)
}

export const getFriendsErrorMessage = (error: unknown) => {
  if (error instanceof FriendsApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message || 'Не удалось загрузить список друзей'
  }

  return 'Не удалось загрузить список друзей'
}
