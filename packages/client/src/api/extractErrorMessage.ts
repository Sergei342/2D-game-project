import { SerializedError } from '@reduxjs/toolkit'

export type BaseQueryError = {
  data: string | { reason: string }
  status: number
}

export const extractErrorMessage = (error: unknown): string => {
  if (!error) return 'Неизвестная ошибка'

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const err = error as BaseQueryError

    if (typeof err.data === 'string') {
      return err.data
    }

    if (err.data?.reason) {
      return err.data.reason
    }

    return `Ошибка ${err.status}`
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as SerializedError).message || 'Ошибка'
  }

  return 'Неизвестная ошибка'
}
