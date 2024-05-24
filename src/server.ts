import dotenvFlow from "dotenv-flow"
dotenvFlow.config()

// Server
import app from "@src/app"

const { PORT = 9000 } = process.env

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}...`)
})
