import { BASE_URL } from '@/shared/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import fetch from 'cross-fetch'

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  fetchFn: fetch,
  prepareHeaders: headers => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'LeaderBoard'],
  endpoints: () => ({}),
})
