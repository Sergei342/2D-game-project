import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit'
import { message } from 'antd'
import { extractErrorMessage } from './extractErrorMessage'

const isBrowser = typeof window !== 'undefined'

export const apiErrorMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const error = action.payload
    const messageText = extractErrorMessage(error)

    if (isBrowser) {
      message.error(messageText)
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error)
    }
  }

  return next(action)
}
