import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'

import { routes } from './routes/routes'
import 'antd/dist/reset.css'
import { ConfigProvider, theme } from 'antd'
import { theme as appTheme } from './config/theme'
import { GlobalStyles } from './styles/styles'

const router = createBrowserRouter(routes)

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <GlobalStyles />
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        ...appTheme,
        hashed: true,
      }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>
)
