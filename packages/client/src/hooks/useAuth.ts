import { useEffect, useState } from 'react'
import { BASE_URL } from '../pages/login/LoginService'

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    fetch(`${BASE_URL}user`, {
      credentials: 'include',
    })
      .then(res => {
        setIsAuth(res.ok)
      })
      .catch(() => {
        setIsAuth(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return { isAuth, isLoading }
}
