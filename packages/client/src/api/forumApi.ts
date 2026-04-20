import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_CONFIG } from './constants'
import fetch from 'cross-fetch'

export const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.forum,
  credentials: 'include',
  fetchFn: fetch,
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
