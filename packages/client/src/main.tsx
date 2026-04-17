import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createAppStore, type RootState } from './store'
import { createBrowserForumStateStorage } from './store/forumStateStorage'
import { routes } from './routes/routes'
import 'antd/dist/reset.css'
import { ConfigProvider, theme } from 'antd'
import { theme as appTheme } from './config/theme'
import { GlobalStyles } from './styles/styles'

declare global {
  interface Window {
    APP_INITIAL_STATE?: RootState
  }
}

const root = document.getElementById('root') as HTMLElement
const router = createBrowserRouter(routes)

const store = createAppStore({
  preloadedState: window.APP_INITIAL_STATE,
  forumStateStorage: createBrowserForumStateStorage(),
})

delete window.APP_INITIAL_STATE

const App = () => {
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

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
