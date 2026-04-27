import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useSelector } from '@/store'
import { selectIsUserInitialized, selectUser } from '@/slices/userSlice'

const FullscreenLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}>
    <Spin size="large" />
  </div>
)

export const ProtectedRoute = () => {
  const user = useSelector(selectUser)
  const isInitialized = useSelector(selectIsUserInitialized)
  const location = useLocation()

  if (isInitialized && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export const GuestRoute = () => {
  const user = useSelector(selectUser)
  const isInitialized = useSelector(selectIsUserInitialized)

  if (!isInitialized) {
    return <FullscreenLoader />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
