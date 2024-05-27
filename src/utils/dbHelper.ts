import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

// Config
import { config } from "@config/postgres.config"

// Database
import * as schema from "@database/schema"

export const pool = new Pool(config)
export const db = drizzle(pool, {
  schema,
})
