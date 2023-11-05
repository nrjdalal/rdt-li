import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const queryClient = postgres(process.env.POSTGRES_URL as string)

export const db: PostgresJsDatabase = drizzle(queryClient)
