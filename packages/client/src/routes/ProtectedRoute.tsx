import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from '@/store'
import { selectUser } from '@/slices/userSlice'

export const ProtectedRoute = () => {
  const user = useSelector(selectUser)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export const GuestRoute = () => {
  const user = useSelector(selectUser)

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
