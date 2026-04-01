import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuth, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />
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
