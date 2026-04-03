import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, useDispatch } from './store'
import { routes } from './routes/routes'

import 'antd/dist/reset.css'
import { ConfigProvider, theme } from 'antd'
import { theme as appTheme } from './config/theme'
import { GlobalStyles } from './styles/styles'
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

ReactDOM.hydrateRoot(
  root,
  <Provider store={store}>
    <App />
  </Provider>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
