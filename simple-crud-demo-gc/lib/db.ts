import { Pool } from 'pg'

declare global {
  var pool: Pool | undefined
}

let pool: Pool

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is not defined. Please check your .env.local file.'
  )
}

const config = {
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
}

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(config)
} else {
  if (!global.pool) {
    global.pool = new Pool(config)
  }
  pool = global.pool
}

export default pool
