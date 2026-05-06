import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createAppStore } from './store'
import 'antd/dist/reset.css'
import { createCache } from '@ant-design/cssinjs'
import { routes } from './routes/routes'
import { AppShell } from './AppShell'
import { useBootstrapUser } from './hooks/useBootstrapUser'

const root = document.getElementById('root') as HTMLElement
const router = createBrowserRouter(routes)
const store = createAppStore()
const cache = createCache()

const App = () => {
  useBootstrapUser()

  return (
    <AppShell store={store} cache={cache}>
      <RouterProvider router={router} />
    </AppShell>
  )
}

ReactDOM.hydrateRoot(
  root,
  <Provider store={store}>
    <App />
  </Provider>
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
