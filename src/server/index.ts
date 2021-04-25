import dotenvFlow from "dotenv-flow"
dotenvFlow.config()

import express from "express"

// Utils
import { pool } from "../utils/dbHelper"

// Routes
import quotesRoutes from "../app/routes/quotesRoutes"

const app = express()

// PG database
pool.connect((err) => {
  if (err) throw new Error(err.message)
})

// Express routes
app.use("/quotes", quotesRoutes)

app.get("/", (_req, res) => {
  res.send("Praise the sun! \\[T]/")
})

app.listen(9000, () => {
  console.log("Server listening on port 9000...")
})
