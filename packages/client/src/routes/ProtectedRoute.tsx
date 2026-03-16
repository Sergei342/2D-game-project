import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BASE_URL } from '@/pages/login/LoginService'

interface Props {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: Props) => {
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return children
}
