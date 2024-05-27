import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core"

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  author: varchar("author", { length: 128 }),
  text: text("text").notNull(),
})
