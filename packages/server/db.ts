import { Client } from 'pg'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env

export const createClientAndConnect = async (): Promise<Client | null> => {
  const maxRetries = 10
  const retryDelay = 3000

  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = new Client({
        user: POSTGRES_USER,
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        password: POSTGRES_PASSWORD,
        port: Number(POSTGRES_PORT),
      })

      await client.connect()

      const res = await client.query('SELECT NOW()')
      console.log('  ➜ 🎸 Connected to the database at:', res?.rows?.[0].now)

      return client
    } catch (e) {
      console.log(`  ➜ Waiting for database... attempt ${i + 1}/${maxRetries}`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }

  console.error('  ➜ Could not connect to database after max retries')
  return null
}
