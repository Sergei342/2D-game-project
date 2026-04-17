import 'reflect-metadata'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { connectToDatabase } from './db'
import { forumRouter } from './routes/forum'
import { authMiddleware } from './middlewares/authMiddleware'
import { swaggerSpec } from './swagger'

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
const port = Number(process.env.SERVER_PORT) || 3001

app.use('/swagger', swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any)
app.use('/api/v1/forum', authMiddleware, forumRouter)

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)')
})

// Сначала подключаемся к БД, потом стартуем Express
async function start(): Promise<void> {
  await connectToDatabase()

  app.listen(port, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
  })
}

start()
