import { useRouteError } from 'react-router-dom'

export const AppErrorBoundary = () => {
  const error = useRouteError()
  return <div>Ошибка!!!: {String(error)}</div>
}
