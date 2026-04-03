import { BASE_URL } from '@/shared/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { message } from 'antd'

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: headers => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseQueryWithErrorHandling: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error) {
    console.error('API Error:', result.error)
    message.error(`API Error: ${result.error}`)
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['User', 'LeaderBoard'],
  endpoints: () => ({}),
})
