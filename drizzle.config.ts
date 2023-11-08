import type { Config } from 'drizzle-kit'
import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';

loadEnvConfig(cwd());

export default {
  schema: './src/lib/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL as string,
  },
} satisfies Config
