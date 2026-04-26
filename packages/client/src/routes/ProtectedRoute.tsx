import { Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  return <Outlet />
}

export const GuestRoute = () => {
  return <Outlet />
}
