import { Pool } from 'pg'
import type { QueryResult } from 'pg'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env

export const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
})

export const query = <
  T extends Record<string, unknown> = Record<string, unknown>
>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(text, params)

const initSchema = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS forum_comments (
      id         SERIAL       PRIMARY KEY,
      topic_id   INTEGER      NOT NULL,
      author     VARCHAR(255) NOT NULL,
      text       TEXT         NOT NULL,
      user_id    INTEGER,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS forum_reactions (
      id         SERIAL       PRIMARY KEY,
      comment_id INTEGER      NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
      user_id    INTEGER      NOT NULL,
      emoji      VARCHAR(32)  NOT NULL,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      CONSTRAINT forum_reactions_unique UNIQUE (comment_id, user_id, emoji)
    )
  `)
}

export const createClientAndConnect = async (): Promise<void> => {
  const maxRetries = 10
  const retryDelay = 3000

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await pool.query<{ now: string }>('SELECT NOW()')
      console.log('  ➜ 🎸 Connected to the database at:', res.rows[0].now)
      await initSchema()
      console.log('  ➜ 🗃️  Schema initialized')
      return
    } catch (_e) {
      console.log(`  ➜ Waiting for database... attempt ${i + 1}/${maxRetries}`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }

  throw new Error('Could not connect to database after max retries')
}
