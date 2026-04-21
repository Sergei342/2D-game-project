import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, useDispatch } from './store'
import { routes } from './routes/routes'
import 'antd/dist/reset.css'
import { ConfigProvider, theme } from 'antd'
import { theme as appTheme } from './config/theme'
import { GlobalStyles } from './styles/styles'
import { useEffect } from 'react'
import { fetchUserThunk } from './slices/userSlice'

const root = document.getElementById('root') as HTMLElement
const router = createBrowserRouter(routes)

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])

  return (
    <>
      <GlobalStyles />
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          ...appTheme,
          hashed: true,
        }}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </>
  )
}

const hasServerRenderedMarkup = root.children.length > 0

const appTree = (
  <Provider store={store}>
    <App />
  </Provider>
)

if (hasServerRenderedMarkup) {
  ReactDOM.hydrateRoot(root, appTree)
} else {
  ReactDOM.createRoot(root).render(appTree)
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
