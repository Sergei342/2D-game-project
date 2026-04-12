import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { ServerStyleSheet } from 'styled-components'
import { Helmet } from 'react-helmet'
import { Request as ExpressRequest } from 'express'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { matchRoutes } from 'react-router-dom'

import {
  createContext,
  createFetchRequest,
  createUrl,
} from './entry-server.utils'
import { createAppStore } from './store'
import { routes } from './routes/routes'
import { AppRouteObject } from './routes/types'
import './index.css'
import { setPageHasBeenInitializedOnServer } from './slices/ssrSlice'
import { ConfigProvider, theme } from 'antd'
import { theme as appTheme } from './config/theme'
import { GlobalStyles } from './styles/styles'
import { api } from './api/baseApi'

export const render = async (req: ExpressRequest) => {
  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req)
  const context = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  const store = createAppStore()
  const url = createUrl(req)

  const foundRoutes = matchRoutes(routes, url) as Array<{
    route: AppRouteObject
  }> | null

  if (!foundRoutes) {
    throw new Error('Страница не найдена!')
  }

  try {
    for (const { route } of foundRoutes) {
      await route.fetchData?.({
        dispatch: store.dispatch,
        state: store.getState(),
        ctx: createContext(req),
      })
    }

    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()))
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e)
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true))

  const router = createStaticRouter(dataRoutes, context)
  const sheet = new ServerStyleSheet()

  try {
    const html = ReactDOM.renderToString(
      sheet.collectStyles(
        <Provider store={store}>
          <GlobalStyles />
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              ...appTheme,
              hashed: true,
            }}>
            <StaticRouterProvider router={router} context={context} />
          </ConfigProvider>
        </Provider>
      )
    )
    const styleTags = sheet.getStyleTags()
    const helmet = Helmet.renderStatic()

    return {
      html,
      helmet,
      styleTags,
      initialState: store.getState(),
    }
  } finally {
    sheet.seal()
  }
}
