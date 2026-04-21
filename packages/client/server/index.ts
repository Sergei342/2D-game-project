import dotenv from 'dotenv'
dotenv.config()

import { HelmetData } from 'react-helmet'
import express, { Request as ExpressRequest } from 'express'
import path from 'path'
import fs from 'fs/promises'
import { createServer as createViteServer, ViteDevServer } from 'vite'
import serialize from 'serialize-javascript'
import cookieParser from 'cookie-parser'

const port = process.env.PORT || 3000
const clientPath = path.join(__dirname, '..')
const isDev = process.env.NODE_ENV === 'development'

const SSR_ROUTES: ReadonlyArray<string> = ['/']

const isSsrPath = (pathname: string): boolean => SSR_ROUTES.includes(pathname)

async function createServer() {
  const app = express()

  app.use(cookieParser())
  let vite: ViteDevServer | undefined

  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    })

    app.use(vite.middlewares)
  } else {
    app.use(
      express.static(path.join(clientPath, 'dist/client'), { index: false })
    )
  }

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const isSsrRoute = isSsrPath(req.path)

    try {
      let template: string

      if (vite) {
        template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        )
        template = await vite.transformIndexHtml(url, template)
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'dist/client/index.html'),
          'utf-8'
        )
      }

      if (!isSsrRoute) {
        return res
          .status(200)
          .set({ 'Content-Type': 'text/html' })
          .end(template)
      }

      let render: (req: ExpressRequest) => Promise<{
        html: string
        initialState: unknown
        helmet: HelmetData
        styleTags: string
      }>

      if (vite) {
        render = (
          await vite.ssrLoadModule(
            path.join(clientPath, 'src/entry-server.tsx')
          )
        ).render
      } else {
        const pathToServer = path.join(
          clientPath,
          'dist/server/entry-server.js'
        )
        render = (await import(pathToServer)).render
      }

      const {
        html: appHtml,
        initialState,
        helmet,
        styleTags,
      } = await render(req)

      const html = template
        .replace('<!--ssr-styles-->', styleTags)
        .replace(
          '<!--ssr-helmet-->',
          `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
        )
        .replace('<!--ssr-outlet-->', appHtml)
        .replace(
          '<!--ssr-initial-state-->',
          `<script>window.APP_INITIAL_STATE = ${serialize(initialState, {
            isJSON: true,
          })}</script>`
        )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (e instanceof Response) {
        const location = e.headers.get('Location')

        if (location && e.status >= 300 && e.status < 400) {
          return res.redirect(e.status, location)
        }

        const body = await e.text().catch(() => e.statusText)
        return res.status(e.status).send(body || e.statusText)
      }

      vite?.ssrFixStacktrace(e as Error)
      next(e)
    }
  })

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`)
  })
}

createServer()
