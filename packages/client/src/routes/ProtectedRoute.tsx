import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuth, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export const GuestRoute = ({ children }: Props) => {
  const { isAuth, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuth) {
    return <Navigate to="/" replace />
  }

  return children
}
