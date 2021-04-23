import dotenvFlow from "dotenv-flow"
dotenvFlow.config()

import express from "express"

// Config
import { client } from "../utils/dbHelper"

const app = express()

client.connect((err) => {
  if (err) throw new Error(err.message)
})

client
  .query("SELECT * FROM quotes;")
  .then((res) => console.log(res.rows[0]))
  .catch((e) => console.error(e.stack))

app.get("/", (_req, res) => {
  res.send("Praise the sun! \\[T]/")
})

app.listen(9000, () => {
  console.log("Server listening on port 9000...")
})
