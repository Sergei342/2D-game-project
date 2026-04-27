import ReactDOM from 'react-dom/server'
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
import { routes } from './routes/routes'
import { AppRouteObject } from './routes/types'
import './index.css'
import { setPageHasBeenInitializedOnServer } from './slices/ssrSlice'
import { api } from './api/baseApi'
import { apiForum } from './api/forumApi'
import 'antd/dist/reset.css'
import { createCache, extractStyle } from '@ant-design/cssinjs'
import { createAppStore } from './store'
import { AppShell } from './AppShell'

export const render = async (req: ExpressRequest) => {
  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req)
  const context = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  const url = createUrl(req)
  const store = createAppStore()

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

    await Promise.all([
      store.dispatch(api.util.getRunningQueriesThunk()),
      store.dispatch(apiForum.util.getRunningQueriesThunk()),
    ])
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e)
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true))

  const router = createStaticRouter(dataRoutes, context)
  const sheet = new ServerStyleSheet()
  const cache = createCache()

  try {
    const html = ReactDOM.renderToString(
      sheet.collectStyles(
        <AppShell store={store} cache={cache}>
          <StaticRouterProvider router={router} context={context} />
        </AppShell>
      )
    )
    const antdStyle = extractStyle(cache)
    const styleTags = sheet.getStyleTags()
    const helmet = Helmet.renderStatic()

    return {
      html,
      helmet,
      styleTags: styleTags + antdStyle,
      initialState: store.getState(),
    }
  } finally {
    sheet.seal()
  }
}
