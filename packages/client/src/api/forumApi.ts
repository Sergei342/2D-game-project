import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getApiConfig } from './utils'

export const baseQuery = fetchBaseQuery({
  baseUrl: getApiConfig().forum,
  credentials: 'include',
  prepareHeaders: headers => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const apiForum = createApi({
  reducerPath: 'apiForum',
  baseQuery,
  tagTypes: ['Topics', 'Topic', 'Comments'],
  endpoints: () => ({}),
})
