import dotenv from 'dotenv'
dotenv.config()

import { createRequire } from 'module'
import express from 'express'
import path from 'path'
import fs from 'fs/promises'
import { createServer as createViteServer, ViteDevServer } from 'vite'

const port = process.env.PORT || 3000
const clientPath = path.join(__dirname, '..')
const isDev =
  process.env.NODE_ENV === 'development' || !process.argv.includes('--prod')
const requireModule = createRequire(__filename)

type Render = () => string

async function createServer() {
  const app = express()
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
    try {
      const url = req.originalUrl
      let template: string
      let render: Render

      if (vite) {
        template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        )
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'dist/client/index.html'),
          'utf-8'
        )
        render = requireModule(
          path.join(clientPath, 'dist/server/entry-server.js')
        ).render
      }

      const appHtml = render()
      const html = template
        .replace('<!--ssr-outlet-->', appHtml)
        .replace('<!--ssr-initial-state-->', '')
        .replace('<!--ssr-styles-->', '')
        .replace('<!--ssr-helmet-->', '')

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (vite && e instanceof Error) {
        vite.ssrFixStacktrace(e)
      }

      next(e)
    }
  })

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`)
  })
}

createServer()
