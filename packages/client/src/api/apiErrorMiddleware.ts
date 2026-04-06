import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit'
import { message } from 'antd'
import { extractErrorMessage } from './extractErrorMessage'

export const apiErrorMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const error = action.payload
    const messageText = extractErrorMessage(error)

    message.error(messageText)

    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error)
    }
  }

  return next(action)
}
