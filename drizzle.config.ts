import type { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL as string,
  },
} satisfies Config
