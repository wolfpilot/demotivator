import { Client } from "pg"

// Config
import { config } from "../config/postgres.config"

export const client = new Client(config)
