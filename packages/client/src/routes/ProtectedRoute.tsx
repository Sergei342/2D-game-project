import { Navigate } from 'react-router-dom'

interface Props {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: Props) => {
  if (typeof window === 'undefined') {
    return null
  }

  const isAuth = localStorage.getItem('isAuth') === 'true'

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return children
}
