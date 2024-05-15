import { PoolConfig } from "pg"

// Utils
import { isRenderHost } from "@utils/envHelper"

const {
  PG_USER,
  PG_HOST,
  PG_DATABASE,
  PG_DATABASE_URL,
  PG_PASSWORD,
  PG_PORT,
} = process.env

export const config: PoolConfig = isRenderHost
  ? {
      connectionString: PG_DATABASE_URL,
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
