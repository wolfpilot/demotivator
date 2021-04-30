import { Pool } from "pg"

// Config
import { config } from "@config/postgres.config"

export const pool = new Pool(config)
