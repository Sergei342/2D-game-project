import { BASE_URL } from '@/shared/constants'

export const getApiConfig = () => ({
  main: BASE_URL,
  forum: 'http://localhost:3001/api/v1/forum',
})
