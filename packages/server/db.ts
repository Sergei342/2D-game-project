import { Sequelize, type SequelizeOptions } from 'sequelize-typescript'
import { UserProfile } from './models/UserProfile'
import { Topic } from './models/Topic'
import { Comment } from './models/Comment'
import { Reaction } from './models/Reaction'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env

const sequelizeOptions: SequelizeOptions = {
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  dialect: 'postgres',
  models: [UserProfile, Topic, Comment, Reaction],
}

const sequelize = new Sequelize(sequelizeOptions)

export async function connectToDatabase(): Promise<void> {
  const maxRetries = 10
  const retryDelay = 3000

  for (let i = 0; i < maxRetries; i++) {
    try {
      await sequelize.authenticate()
      await sequelize.sync({ alter: true }) // пока так, в других здаачах должны быть миграции

      console.log('  ➜ 🎸 Connected to the database')
      return
    } catch (e) {
      console.log(`  ➜ Waiting for database... attempt ${i + 1}/${maxRetries}`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }

  throw new Error('Could not connect to database after max retries')
}
