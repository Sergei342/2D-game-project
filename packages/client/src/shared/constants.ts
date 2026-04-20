export const HttpStatus = {
  Success: 200,
  Unauthorized: 401,
  ServerError: 500,
} as const

export const BASE_URL = 'https://ya-praktikum.tech/api/v2'
export const VITE_FORUM_API = import.meta.env.VITE_FORUM_API

export const API_FIELD_TEAM_NAME = 'C58_Space_Invaders'
export const API_FIELD_RATING_FIELD_NAME = 'c58SITScore'

export const YANDEX_OAUTH_URL = 'https://oauth.yandex.ru/authorize'
export const OAUTH_REDIRECT_URI = `${
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000'
}/oauth`
