import { PoolConfig } from "pg"

const {
  DATABASE_URL,
  PG_USER,
  PG_HOST,
  PG_DATABASE,
  PG_PASSWORD,
  PG_PORT,
} = process.env

const isHeroku = !!DATABASE_URL

export const config: PoolConfig = isHeroku
  ? {
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      user: PG_USER,
      host: PG_HOST,
      database: PG_DATABASE,
      password: PG_PASSWORD,
      port: (PG_PORT && parseInt(PG_PORT, 10)) || 5432,
    }
