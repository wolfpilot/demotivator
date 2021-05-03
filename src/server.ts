import dotenvFlow from "dotenv-flow"

dotenvFlow.config({
  node_env: process.env.NODE_ENV || "development",
})

// Server
import app from "@src/app"

const { SERVER_PORT = 9000 } = process.env

app.listen(SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${SERVER_PORT}...`)
})
