import { StyleProvider, createCache } from '@ant-design/cssinjs'
import { AppStore } from './store'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { GlobalStyles } from './styles/styles'
import { ConfigProvider, theme } from 'antd'
import { theme as appTheme } from './config/theme'

type AppShellProps = {
  store: AppStore
  cache?: ReturnType<typeof createCache>
}

export const AppShell = ({
  store,
  cache,
  children,
}: PropsWithChildren<AppShellProps>) => {
  return (
    <Provider store={store}>
      <StyleProvider cache={cache}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            ...appTheme,
            hashed: true,
          }}>
          <GlobalStyles />
          {children}
        </ConfigProvider>
      </StyleProvider>
    </Provider>
  )
}
