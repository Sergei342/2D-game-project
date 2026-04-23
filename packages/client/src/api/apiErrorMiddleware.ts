import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit'

export const apiErrorMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const error = action.payload

    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error)
    }
  }

  return next(action)
}
