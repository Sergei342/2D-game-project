import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getApiConfig } from './utils'

export const baseQuery = fetchBaseQuery({
  baseUrl: getApiConfig().main,
  credentials: 'include',
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
