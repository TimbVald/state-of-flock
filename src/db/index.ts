import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export const createServerDb = () => {
  const url = process.env.DATABASE_URL as string
  const client = postgres(url, { prepare: false })
  return drizzle(client)
}