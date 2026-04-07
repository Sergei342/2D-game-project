import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import express from 'express'
import { createClientAndConnect } from './db'

const app = express()
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
const port = Number(process.env.SERVER_PORT) || 3001

createClientAndConnect()

app.get('/friends', (_, res) => {
  res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ])
})

app.get('/auth/user', (_, res) => {
  res.json({
    id: 1,
    first_name: 'Федя',
    second_name: 'Пупкин',
    display_name: null,
    login: 'fedya',
    avatar: null,
    email: 'fedyaInvader@mail.ru',
    phone: '+79998887766',
  })
})

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)')
})

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})
