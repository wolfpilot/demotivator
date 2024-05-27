import dotenvFlow from "dotenv-flow"
dotenvFlow.config()

// Utils
import { db } from "@utils/dbHelper"

// Database
import { quotes } from "@database/schema"
import { quotesSeedData } from "@database/seeds/quotesSeed"

const main = async (): Promise<void> => {
  try {
    // eslint-disable-next-line no-console
    console.log("Seeding DB...")

    await db.delete(quotes)

    await db.insert(quotes).values(quotesSeedData)
  } catch (error) {
    console.error(error)

    throw new Error("Failed to seed DB.")
  }
}

main()
