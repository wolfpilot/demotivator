import dotenvFlow from "dotenv-flow"
dotenvFlow.config()

import { migrate } from "drizzle-orm/node-postgres/migrator"

// Utils
import { db } from "@utils/dbHelper"

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "src/database/migrations",
    })

    console.log("Migration successful")
  } catch (err) {
    console.error(err)

    process.exit(1)
  }
}

main()
